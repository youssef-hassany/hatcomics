import CreateListForm from "@/components/lists/CreateListForm";
import PageHeader from "@/components/ui/PageHeader";
import { List } from "lucide-react";
import React from "react";

const CreateListPage = () => {
  return (
    <div>
      <PageHeader
        Icon={List}
        title="Create List"
        description="Start Creating A List that shows your interests"
      />

      <CreateListForm />
    </div>
  );
};

export default CreateListPage;
