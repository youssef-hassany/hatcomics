"use client";

import React, { useState } from "react";
import { Download, Edit3, Library } from "lucide-react";
import { Button } from "../ui/button";
import { ImportedComic } from "@/types/Roadmap";
import { Modal } from "../ui/modal";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import LocalComicsList from "../roadmap/LocalComicsForm";
import ExternalComicList from "../roadmap/ExternalComicList";
import { useAddItemToList } from "@/hooks/lists/useAddItemToList";
import { ListEntryMutation } from "@/types/List";

const AddItemToListForm: React.FC = () => {
  const router = useRouter();
  const { id: listId } = useParams();

  const [formFields, setFormFields] = useState({
    title: "",
    image: "",
  });

  const [localOpen, setLocalOpen] = useState(false);
  const [externalOpen, setExternalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSelect = (item: ImportedComic) => {
    setFormFields({
      image: item.image,
      title: item.name,
    });
    setExternalOpen(false);
    setLocalOpen(false);
  };

  const { mutateAsync: addItemToList, isPending } = useAddItemToList();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const entry: ListEntryMutation = {
        title: formFields.title,
        listId: listId as string,
        image: formFields.image,
      };

      await addItemToList({ listId: listId as string, entry });

      setFormFields({
        title: "",
        image: "",
      });
      toast.success("Item Added Successfully");
      router.replace(`/lists/${listId}/manage`);
    } catch (error) {
      console.error(error);
      toast.error("Error adding item, try again");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-700 overflow-hidden">
          {/* Header */}
          <header className="bg-gradient-to-r from-orange-600 to-orange-500 p-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Edit3 className="w-8 h-8" />
              Add Item To Your List
            </h1>
            <p className="text-orange-100 mt-2">
              Complete your list by adding another item
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* import comic */}
            <div className="space-y-3">
              <label
                htmlFor="title"
                className="block text-lg font-semibold text-zinc-200"
              >
                Import Comic/character <span className="text-red-400">*</span>
              </label>

              <div className="flex items-center justify-center gap-4 flex-col sm:flex-row w-full max-w-md mx-auto">
                <Button
                  onClick={() => setLocalOpen(true)}
                  type="button"
                  className="w-full sm:w-auto min-w-[200px] group"
                >
                  <Library className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Import Comic From HatComics
                </Button>

                <Button
                  onClick={() => setExternalOpen(true)}
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto min-w-[200px] group"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Import Item From External Library
                </Button>
              </div>
            </div>

            {/* comic image */}
            {formFields.image && (
              <div className="space-y-3">
                <label
                  htmlFor="title"
                  className="block text-lg font-semibold text-zinc-200"
                >
                  Image
                </label>

                <img src={formFields.image} className="w-64 rounded" />
              </div>
            )}

            {/* Title Field */}
            <div className="space-y-3">
              <label
                htmlFor="title"
                className="block text-lg font-semibold text-zinc-200"
              >
                Item Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formFields.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-zinc-600 rounded-xl bg-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter or import comic name..."
                required
                aria-describedby="title-help"
              />
              <div id="title-help" className="sr-only">
                Enter a descriptive name for the item
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-700">
              <Button
                isLoading={isPending}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add Item
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* modals */}
      <Modal isOpen={localOpen} onClose={() => setLocalOpen(false)}>
        <LocalComicsList onSelect={onSelect} />
      </Modal>

      <Modal isOpen={externalOpen} onClose={() => setExternalOpen(false)}>
        <ExternalComicList onSelect={onSelect} />
      </Modal>
    </div>
  );
};

export default AddItemToListForm;
