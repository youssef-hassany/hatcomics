import React, { useState, useEffect } from "react";
import { Download, Edit3, Library } from "lucide-react";
import RichTextEditor from "../ui/RichTextEditor";
import { Button } from "../ui/button";
import { AddEntryRequest, ImportedComic, RoadmapEntry } from "@/types/Roadmap";
import { Modal } from "../ui/modal";
import LocalComicsList from "./LocalComicsForm";
import ExternalComicList from "./ExternalComicList";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateComicInRoadmap } from "@/hooks/roadmaps/useUpdateComicInRoadmap";

interface UpdateComicToRoadmapFormProps {
  entry: RoadmapEntry;
  onCancel: () => void;
}

const UpdateComicToRoadmapForm: React.FC<UpdateComicToRoadmapFormProps> = ({
  entry,
  onCancel,
}) => {
  const router = useRouter();
  const { id: roadmapId } = useParams();

  const [formFields, setFormFields] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [localOpen, setLocalOpen] = useState(false);
  const [externalOpen, setExternalOpen] = useState(false);

  const [importedComic, setImportedComic] = useState<ImportedComic | null>(
    null
  );

  // Initialize form with existing entry data
  useEffect(() => {
    if (entry) {
      setFormFields({
        title: entry.title,
        description: entry.description || "",
        image: entry.image || entry.comic?.image || "",
      });

      // Set imported comic based on existing entry data
      const existingComic: ImportedComic = {
        name: entry.comicName,
        image: entry.image || entry.comic?.image || "",
        description: entry.comicDescription || entry.comic?.description || "",
        comicId: entry.comicId,
        externalId: entry.externalId ? Number(entry.externalId) : undefined,
        externalSource: entry.externalSource,
        publisher: entry.publisher || entry.comic?.publisher,
        issueNumber: entry.issueNumber
          ? Number(entry.issueNumber)
          : entry.comic?.issueNumber
          ? Number(entry.comic.issueNumber)
          : undefined,
      };

      setImportedComic(existingComic);
    }
  }, [entry]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormFields((prev) => ({ ...prev, description: value }));
  };

  const onSelect = (comic: ImportedComic) => {
    setImportedComic(comic);
    setFormFields({
      description: comic.description,
      image: comic.image,
      title: comic.name,
    });
    setExternalOpen(false);
    setLocalOpen(false);
    onCancel();
  };

  const { mutateAsync: updateComicInRoadmap, isPending } =
    useUpdateComicInRoadmap();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!importedComic) {
      toast.error("Please select a comic first");
      return;
    }

    try {
      const updateEntry: AddEntryRequest = {
        title: formFields.title,
        description: formFields.description,
        order: entry.order, // Keep the same order
        comic: {
          id: (importedComic?.externalSource
            ? importedComic.externalId?.toString()
            : importedComic?.comicId?.toString()) as string,
          source: importedComic?.externalSource ? "comicvine" : "local",
          description: importedComic?.description,
          image: importedComic?.image,
          issueNumber: importedComic?.issueNumber?.toString(),
          name: importedComic?.name,
          publisher: importedComic?.publisher || "",
        },
      };

      await updateComicInRoadmap({
        roadmapId: roadmapId as string,
        entryId: entry.id,
        entry: updateEntry,
      });

      toast.success("Comic Updated Successfully");
      router.replace(`/roadmaps/${roadmapId}/manage`);
    } catch (error) {
      console.error(error);
      toast.error("Error updating comic, try again");
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
              Update Comic In Your Roadmap
            </h1>
            <p className="text-orange-100 mt-2">Modify your roadmap comic</p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* import comic */}
            <div className="space-y-3">
              <label
                htmlFor="title"
                className="block text-lg font-semibold text-zinc-200"
              >
                Import Comic <span className="text-red-400">*</span>
              </label>

              <div className="flex items-center justify-center gap-4 flex-col sm:flex-row w-full max-w-md mx-auto">
                <Button
                  onClick={() => setLocalOpen(true)}
                  type="button"
                  className="w-full sm:w-auto min-w-[200px] group"
                >
                  <Library className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Import From HatComics Library
                </Button>

                <Button
                  onClick={() => setExternalOpen(true)}
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto min-w-[200px] group"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Import From External Library
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
                  Comic Cover
                </label>

                <img
                  src={formFields.image}
                  className="w-64 rounded"
                  alt="Comic cover"
                />
              </div>
            )}

            {/* Title Field */}
            <div className="space-y-3">
              <label
                htmlFor="title"
                className="block text-lg font-semibold text-zinc-200"
              >
                Comic Name <span className="text-red-400">*</span>
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
                Enter a descriptive name for your roadmap entry
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
                  aria-label="Entry description"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-700">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="px-6 py-3"
              >
                Cancel
              </Button>

              <Button
                isLoading={isPending}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Update Entry
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

export default UpdateComicToRoadmapForm;
