import NotAuthorized from "@/components/common/NotAuthorized";
import UpdateListForm from "@/components/lists/UpdateListForm";
import { listService } from "@/services/list.service";
import { userService } from "@/services/user.service";
import { auth } from "@clerk/nextjs/server";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const ManageListPage = async ({ params }: Props) => {
  const { userId } = await auth();
  const visitor = await userService.getUserById(userId!);

  const { id } = await params;
  const listData = await listService.getList(id, userId!);

  if (visitor && visitor.id !== listData.createdBy) {
    return <NotAuthorized />;
  }

  return (
    <div>
      <UpdateListForm listId={id} />
    </div>
  );
};

export default ManageListPage;
