"use client";

import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { ComicIssue } from "@/types/comic-vine";
import RichTextEditor from "../ui/RichTextEditor";
import { createComic } from "@/app/actions/actions";
import { toast } from "sonner";

interface Props {
  selectedComic: ComicIssue | null;
  onSuccess: () => void;
}

const AddComicForm = ({ selectedComic, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    description: "",
    image: "",
    publisher: "",
    authors: [""],
    numberOfIssues: 0,
    isBeginnerFriendly: false,
    characters: ["spider-man"],
    isOnGoing: false,
    isIndie: false,
  });

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
        return;
      }

      if (cleanedData.numberOfIssues <= 0) {
        return;
      }

      const result = await createComic(cleanedData);

      if (result.success) {
        onSuccess();
        toast.success("comic added successfully");
        setFormFields({
          name: "",
          description: "",
          image: "",
          publisher: "",
          authors: [""],
          numberOfIssues: 0,
          isBeginnerFriendly: false,
          characters: ["spider-man"],
          isOnGoing: false,
          isIndie: false,
        });
      } else {
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedComic) {
      // @ts-expect-error: selectedComic may have extra fields not in formFields
      setFormFields((prev) => ({
        ...prev, // Preserve existing fields including arrays
        name: selectedComic.name || "",
        image: selectedComic.image?.original_url || "",
        numberOfIssues: selectedComic.issue_number || 0,
        description: selectedComic.description || "",
      }));
    }
  }, [selectedComic]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-10 p-6 rounded-xl shadow space-y-6"
    >
      <h1 className="text-2xl font-bold">Add Comic</h1>

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
        <label className="font-medium">Ongoing?</label>
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-2 rounded-lg font-semibold transition-colors"
      >
        {isSubmitting ? "Creating Comic..." : "Submit"}
      </button>
    </form>
  );
};

export default AddComicForm;
