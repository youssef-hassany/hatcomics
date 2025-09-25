import React, { useState } from "react";
import { Edit3 } from "lucide-react";
import RichTextEditor from "../ui/RichTextEditor";
import ComicsReorderComponent from "./ComicsReorderComponent";
import { RoadmapEntry, RoadmapType } from "@/types/Roadmap";
import ComicsReorderGrid from "./ComicsReorderGrid";
import { Button } from "../ui/button";
import { getOrdersFromEntries } from "@/lib/utils";
import { Modal } from "../ui/modal";
import UpdateComicToRoadmapForm from "./UpdateComicToRoadmapForm";
import { usePostRoadmap } from "@/hooks/roadmaps/usePostRoadmap";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DeleteRoadmapModal from "./DeleteRoadmapModal";
import { useUpdateRoadmap } from "@/hooks/roadmaps/useUpdateRoadmap";
import DeleteComicFromRoadmapModal from "./DeleteComicFromRoadmapModal";

interface Props {
  roadmap: RoadmapType;
}

const ManageRoadmapForm: React.FC<Props> = ({ roadmap }) => {
  const router = useRouter();

  const [formFields, setFormFields] = useState({
    title: roadmap?.title || "",
    description: roadmap?.description || "",
    image: "",
  });

  const [isReordering, setIsReordering] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEntryForUpdate, setSelectedEntryForUpdate] =
    useState<RoadmapEntry | null>(null);
  const [selectedEntryForDelete, setSelectedEntryForDelete] = useState<
    string | null
  >(null);

  const handleDescriptionChange = (value: string) => {
    setFormFields((prev) => ({ ...prev, description: value }));
  };

  const handleReorderClick = (): void => {
    setIsReordering(true);
  };

  const handleReorderCancel = (): void => {
    setIsReordering(false);
  };

  const { mutateAsync: postRoadamap, isPending: isPosting } = usePostRoadmap();
  const handlePost = async () => {
    try {
      await postRoadamap(roadmap.id);
      toast.success("Roadmap Posted Successfully");
      router.replace(`/roadmaps/${roadmap.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Error Posting Roadmap, Try Again");
    }
  };

  const closeUpdateModal = () => {
    setSelectedEntryForUpdate(null);
  };

  const { mutateAsync: updateRoadmap, isPending: isUpdating } =
    useUpdateRoadmap();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateRoadmap({
        roadmapId: roadmap.id,
        title: formFields.title,
        description: formFields.description,
      });
      toast.success("Roadmap Updated Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error Updating Roadmap, Try Again");
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
              Manage Your Roadmap
            </h1>
            <p className="text-orange-100 mt-2">
              Customize your comic reading journey
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title Field */}
            <div className="space-y-3">
              <label
                htmlFor="title"
                className="block text-lg font-semibold text-zinc-200"
              >
                Roadmap Name <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formFields.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-zinc-600 rounded-xl bg-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your roadmap title..."
                required
                aria-describedby="title-help"
              />
              <div id="title-help" className="sr-only">
                Enter a descriptive name for your roadmap
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <label
                htmlFor="description"
                className="block text-lg font-semibold text-zinc-200"
              >
                Description
              </label>
              <div id="description">
                <RichTextEditor
                  value={formFields.description}
                  onChange={handleDescriptionChange}
                  aria-label="Roadmap description"
                />
              </div>
            </div>

            {/* Comics Section */}
            <fieldset className="space-y-4">
              <legend className="sr-only">Comics management</legend>

              {isReordering ? (
                <ComicsReorderComponent
                  comics={getOrdersFromEntries(roadmap.entries)}
                  onCancel={handleReorderCancel}
                  roadmapId={roadmap.id}
                />
              ) : (
                <ComicsReorderGrid
                  comics={roadmap.entries}
                  onReorderClick={handleReorderClick}
                  roadmapId={roadmap.id}
                  onEditComic={setSelectedEntryForUpdate}
                  onDeleteComic={setSelectedEntryForDelete}
                />
              )}
            </fieldset>

            {/* Action Buttons */}
            {!isReordering && (
              <div className="flex items-center justify-between pt-6 border-t border-zinc-700">
                <Button
                  type="button"
                  onClick={() => setIsDeleteOpen(true)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Delete Roadmap
                </Button>

                <div className="flex items-center justify-end gap-4">
                  {!isReordering && !roadmap.isPublic && (
                    <Button
                      type="button"
                      onClick={handlePost}
                      disabled={roadmap.entries.length === 0}
                      isLoading={isPosting}
                      className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Post Roadmap
                    </Button>
                  )}

                  <Button
                    disabled={isUpdating}
                    isLoading={isUpdating}
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* modals */}
      <Modal isOpen={!!selectedEntryForUpdate} onClose={closeUpdateModal}>
        {selectedEntryForUpdate && (
          <UpdateComicToRoadmapForm
            entry={selectedEntryForUpdate}
            onCancel={() => setSelectedEntryForUpdate(null)}
          />
        )}
      </Modal>

      <DeleteRoadmapModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        roadmapId={roadmap.id}
      />

      <DeleteComicFromRoadmapModal
        entryId={selectedEntryForDelete}
        isOpen={!!selectedEntryForDelete}
        roadmapId={roadmap.id}
        onClose={() => setSelectedEntryForDelete(null)}
      />
    </div>
  );
};

export default ManageRoadmapForm;
