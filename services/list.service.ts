import { prisma } from "@/lib/db";
import paginate from "@/lib/pagination";
import { ListEntryMutation } from "@/types/List";
import { ReorderRequest } from "@/types/Roadmap";
import { ListType } from "@prisma/client";

class ListService {
  /* ------- Private Helper Methods ------- */

  /**
   * Verifies that the user is the owner of the list
   * @throws {Error} If list not found or user is not the owner
   */
  private async verifyListOwnership(listId: string, userId: string) {
    const list = await prisma.list.findUnique({
      where: { id: listId },
      select: { id: true, createdBy: true },
    });

    if (!list) {
      throw new Error("List not found");
    }

    if (list.createdBy !== userId) {
      throw new Error("Only the list creator can perform this action");
    }

    return list;
  }

  /* ------- List Methods ------- */

  /**
   * Creates a new list
   * @returns The created list
   */
  async createList(params: {
    title: string;
    image: string | undefined;
    userId: string;
    type?: ListType;
  }) {
    const { image, title, userId, type } = params;

    return await prisma.list.create({
      data: {
        title,
        createdBy: userId,
        image,
        type,
      },
    });
  }

  /**
   * Deletes a list (only by owner)
   */
  async deleteList(listId: string, userId: string) {
    await this.verifyListOwnership(listId, userId);

    await prisma.list.delete({
      where: { id: listId },
    });
  }

  /**
   * Updates a list (only by owner)
   * @returns The updated list
   */
  async updateList(params: {
    title: string;
    image: string | undefined;
    listId: string;
    userId: string;
    type?: ListType;
  }) {
    const { image, listId, title, userId, type } = params;

    await this.verifyListOwnership(listId, userId);

    return await prisma.list.update({
      data: {
        title,
        image,
        type,
      },
      where: {
        id: listId,
      },
    });
  }

  /**
   * Gets all lists created by a user (paginated)
   */
  async getUserLists(userId: string, page: number) {
    return await paginate({
      model: "list",
      page,
      where: { createdBy: userId },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  /**
   * Gets all lists (paginated)
   */
  async getAllLists(page: number, filter: string | undefined) {
    return await paginate({
      model: "list",
      page,
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        creator: {
          select: {
            username: true,
            fullname: true,
            photo: true,
          },
        },
      },
      ...(filter && {
        where: {
          title: {
            contains: filter,
            mode: "insensitive",
          },
        },
      }),
    });
  }

  /**
   * Gets a single list with all its entries
   */
  async getList(listId: string, userId?: string) {
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: {
        entries: {
          orderBy: { order: "asc" }, // Always return entries in order!
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        ...(userId && {
          likes: {
            where: { userId }, // Only get current user's like
            select: { userId: true },
          },
        }),
        creator: {
          select: {
            fullname: true,
            username: true,
            id: true,
            photo: true,
          },
        },
      },
    });

    const data = list
      ? {
          ...list,
          // Only check if logged in user has liked
          isLikedByCurrentUser: userId ? (list.likes?.length || 0) > 0 : false,
        }
      : list;

    return data;
  }

  /* ------- List Entry Methods ------- */

  /**
   * Adds a new item to a list (only by list owner)
   * @returns The created entry
   */
  async addItemToList(params: ListEntryMutation & { userId: string }) {
    const { listId, title, image, userId } = params;

    await this.verifyListOwnership(listId, userId);

    // Use transaction to prevent race conditions
    return await prisma.$transaction(async (tx) => {
      const itemsCount = await tx.listEntry.count({
        where: { listId },
      });

      return await tx.listEntry.create({
        data: {
          title,
          listId,
          image,
          order: itemsCount + 1,
        },
      });
    });
  }

  /**
   * Updates an existing list entry (only by list owner)
   * @returns The updated entry
   */
  async updateItem(params: {
    title: string;
    itemId: string;
    image: string | undefined;
    listId: string;
    userId: string;
  }) {
    const { itemId, title, image, listId, userId } = params;

    await this.verifyListOwnership(listId, userId);

    return await prisma.listEntry.update({
      data: {
        title,
        image,
      },
      where: { id: itemId },
    });
  }

  /**
   * Removes an item from a list and reorders remaining items
   */
  async removeItemFromList(params: {
    itemId: string;
    listId: string;
    userId: string;
  }) {
    const { itemId, listId, userId } = params;

    await this.verifyListOwnership(listId, userId);

    // Use transaction to ensure atomic delete + reorder
    await prisma.$transaction(async (tx) => {
      const deletedItem = await tx.listEntry.delete({
        where: { id: itemId },
      });

      // Decrement order for all items that came after the deleted item
      await tx.listEntry.updateMany({
        where: {
          listId: listId,
          order: {
            gt: deletedItem.order as number,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });
    });
  }

  /**
   * Reorders multiple list items in a single transaction
   */
  async reOrderListItems(params: {
    reOrderRequest: ReorderRequest;
    listId: string;
    userId: string;
  }) {
    const { reOrderRequest, listId, userId } = params;

    await this.verifyListOwnership(listId, userId);

    await prisma.$transaction(async (tx) => {
      // Use Promise.all to wait for all updates to complete
      await Promise.all(
        reOrderRequest.entryOrders.map((item) =>
          tx.listEntry.update({
            data: {
              order: item.newOrder,
            },
            where: {
              id: item.entryId,
            },
          })
        )
      );
    });
  }
}

export const listService = new ListService();
