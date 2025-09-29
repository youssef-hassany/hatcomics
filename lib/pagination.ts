import { PrismaClient } from "@prisma/client";
import { prisma } from "./db";

interface PaginationOptions<T extends keyof PrismaClient> {
  model: T; // e.g. "user", "post"
  page?: number;
  limit?: number;
  where?: any; // Prisma where input
  orderBy?: any; // Prisma orderBy input
  include?: any; // Prisma include input
  select?: any; // Prisma select input
}

export default async function paginate<T extends keyof PrismaClient>(
  options: PaginationOptions<T>
) {
  const {
    model,
    page = 1,
    limit = 20,
    where = {},
    orderBy = { createdAt: "desc" },
    include,
    select,
  } = options;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    (prisma[model] as any).findMany({
      where,
      orderBy,
      include,
      select,
      skip,
      take: limit,
    }),
    (prisma[model] as any).count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;

  return {
    data,
    meta: {
      totalPages: total,
      currentPage: page,
      lastPage: Math.ceil(total / limit),
      hasNextPage,
    },

    // paginatedData,
    // hasNextPage,
    // currentPage: pageNumber,
    // totalPages: Math.ceil(data.length / limit),
  };
}
