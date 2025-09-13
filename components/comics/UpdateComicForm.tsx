"use client";

import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import RichTextEditor from "../ui/RichTextEditor";
import { updateComic } from "@/app/actions/actions";
import { toast } from "sonner";
import { ComicPreview } from "@/types/Comic";

interface Props {
  comic: ComicPreview;
  onSuccess: () => void;
  onCancel?: () => void;
}

const UpdateComicForm = ({ comic, onSuccess, onCancel }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    description: "",
    image: "",
    publisher: "",
    authors: [""],
    numberOfIssues: 0,
    isBeginnerFriendly: false,
    characters: [""],
    isOnGoing: false,
    isIndie: false,
  });

  // Initialize form with existing comic data
  useEffect(() => {
    if (comic) {
      setFormFields({
        name: comic.name || "",
        description: comic.description || "",
        image: comic.image || "",
        publisher: comic.publisher || "",
        authors: comic.authors.length > 0 ? comic.authors : [""],
        numberOfIssues: comic.numberOfIssues || 0,
        isBeginnerFriendly: comic.isBeginnerFriendly || false,
        characters: comic.characters.length > 0 ? comic.characters : [""],
        isOnGoing: comic.ongoing || false,
        isIndie: comic.isIndie || false,
      });
    }
  }, [comic]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "characters" | "authors"
  ) => {
    const newArray = [...formFields[field]];
    newArray[index] = e.target.value;
    setFormFields((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const addArrayItem = (field: "characters" | "authors") => {
    setFormFields((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field: "characters" | "authors", index: number) => {
    const updatedArray = [...formFields[field]];
    updatedArray.splice(index, 1);
    setFormFields((prev) => ({
      ...prev,
      [field]: updatedArray,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty values from arrays
      const cleanedData = {
        id: comic.id,
        name: formFields.name,
        description: formFields.description || undefined,
        publisher: formFields.publisher,
        authors: formFields.authors.filter((author) => author.trim() !== ""),
        characters: formFields.characters.filter((char) => char.trim() !== ""),
        numberOfIssues: Number(formFields.numberOfIssues),
        image: formFields.image || undefined,
        isBeginnerFriendly: formFields.isBeginnerFriendly,
        isOnGoing: formFields.isOnGoing,
        isIndie: formFields.isIndie,
      };

      // Validate required fields
      if (
        !cleanedData.name ||
        !cleanedData.publisher ||
        cleanedData.authors.length === 0
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (cleanedData.numberOfIssues <= 0) {
        toast.error("Number of issues must be greater than 0");
        return;
      }

      const result = await updateComic(cleanedData);

      if (result.success) {
        onSuccess();
        toast.success("Comic updated successfully");
      } else {
        toast.error(result.error || "Failed to update comic");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-10 p-6 rounded-xl shadow space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Update Comic</h1>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          value={formFields.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Description</label>
        <RichTextEditor
          value={formFields.description}
          onChange={(value) =>
            setFormFields((prev) => ({ ...prev, description: value }))
          }
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Image URL</label>
        <input
          name="image"
          value={formFields.image}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          disabled={isSubmitting}
        />
        {formFields.image && (
          <div className="mt-2">
            <img
              src={formFields.image}
              alt="Comic preview"
              className="w-24 h-36 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">
          Publisher <span className="text-red-500">*</span>
        </label>
        <input
          name="publisher"
          value={formFields.publisher}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Authors */}
      <div>
        <label className="block font-medium mb-1">
          Authors <span className="text-red-500">*</span>
        </label>
        {formFields.authors &&
          formFields.authors.map((author, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                value={author}
                onChange={(e) => handleArrayChange(e, i, "authors")}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter author name"
                disabled={isSubmitting}
              />
              {formFields.authors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("authors", i)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        <button
          type="button"
          onClick={() => addArrayItem("authors")}
          className="flex items-center text-sm text-orange-600 hover:underline disabled:opacity-50"
          disabled={isSubmitting}
        >
          <Plus className="w-4 h-4 mr-1" /> Add author
        </button>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">
          Number of Issues <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="numberOfIssues"
          value={formFields.numberOfIssues}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          min="1"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isOnGoing"
          checked={formFields.isOnGoing}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <label className="font-medium">Is Ongoing?</label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isBeginnerFriendly"
          checked={formFields.isBeginnerFriendly}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <label className="font-medium">Beginner Friendly?</label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isIndie"
          checked={formFields.isIndie}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <label className="font-medium">Indie?</label>
      </div>

      {/* Characters */}
      <div>
        <label className="block font-medium mb-1">Characters</label>
        {formFields.characters &&
          formFields.characters.map((char, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                value={char}
                onChange={(e) => handleArrayChange(e, i, "characters")}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter character name"
                disabled={isSubmitting}
              />
              {formFields.characters.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("characters", i)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        <button
          type="button"
          onClick={() => addArrayItem("characters")}
          className="flex items-center text-sm text-orange-600 hover:underline disabled:opacity-50"
          disabled={isSubmitting}
        >
          <Plus className="w-4 h-4 mr-1" /> Add character
        </button>
      </div>

      <div className="flex space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-2 rounded-lg font-semibold transition-colors"
        >
          {isSubmitting ? "Updating Comic..." : "Update Comic"}
        </button>
      </div>
    </form>
  );
};

export default UpdateComicForm;
