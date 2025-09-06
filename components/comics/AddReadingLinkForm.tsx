"use client";

import { useAddReadingLink } from "@/hooks/comics/useAddReadingLink";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const colorOptions = [
  { value: "orange", label: "Orange", bgColor: "bg-orange-500" },
  { value: "yellow", label: "Yellow", bgColor: "bg-yellow-500" },
  { value: "rose", label: "Rose", bgColor: "bg-rose-500" },
  { value: "cyan", label: "Cyan", bgColor: "bg-cyan-500" },
  { value: "blue", label: "Blue", bgColor: "bg-blue-500" },
  { value: "white", label: "White", bgColor: "bg-white" },
  { value: "green", label: "Green", bgColor: "bg-green-500" },
  { value: "purple", label: "Purple", bgColor: "bg-purple-500" },
  { value: "red", label: "Red", bgColor: "bg-red-500" },
  { value: "lime", label: "Lime", bgColor: "bg-lime-500" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
];

const AddReadingLinkForm = ({
  comicId,
  onSuccess,
  onCancel,
}: {
  comicId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) => {
  const { mutateAsync: addLink, isPending } = useAddReadingLink(comicId);

  const [formData, setFormData] = useState({
    readingLink: "",
    color: "orange",
    language: "ar",
    translatorName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.readingLink.trim() || !formData.translatorName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await addLink({
        comicId,
        url: formData.readingLink,
        translatorName: formData.translatorName,
        language: formData.language,
        color: formData.color,
      });
      toast.success("Reading Link added to the comic!");
      onSuccess();
    } catch (error) {
      toast.error("Something went wrong, try again");
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-10 p-6 bg-zinc-900 rounded-xl shadow-lg space-y-6 border border-zinc-800"
    >
      <h1 className="text-2xl font-bold text-zinc-100">Add Reading Link</h1>

      {/* Translator Name */}
      <div className="space-y-2">
        <label className="block font-medium text-zinc-200">
          Translator Name <span className="text-red-500">*</span>
        </label>
        <input
          name="translatorName"
          value={formData.translatorName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter translator name"
          required
        />
      </div>

      {/* Reading Link URL */}
      <div className="space-y-2">
        <label className="block font-medium text-zinc-200">
          Reading Link URL <span className="text-red-500">*</span>
        </label>
        <input
          name="readingLink"
          value={formData.readingLink}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter reading link URL"
          type="url"
          required
        />
      </div>

      {/* Language Selection */}
      <div className="space-y-2">
        <label className="block font-medium text-zinc-200">
          Language <span className="text-red-500">*</span>
        </label>
        <select
          name="language"
          value={formData.language}
          onChange={handleSelectChange}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        >
          {languageOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-zinc-800"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <label className="block font-medium text-zinc-200">
          Color Theme <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-5 gap-3">
          {colorOptions.map((option) => (
            <label
              key={option.value}
              className={`
                relative cursor-pointer p-3 rounded-lg border-2 transition-all duration-200
                ${
                  formData.color === option.value
                    ? "border-zinc-400 bg-zinc-700"
                    : "border-zinc-700 hover:border-zinc-600 bg-zinc-800"
                }
              `}
            >
              <input
                type="radio"
                name="color"
                value={option.value}
                checked={formData.color === option.value}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 
                    ${option.bgColor} 
                    ${
                      option.value === "white"
                        ? "border-zinc-600"
                        : "border-zinc-800"
                    }
                  `}
                />
                <span className="text-xs text-zinc-300 font-medium">
                  {option.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            !formData.readingLink.trim() || !formData.translatorName.trim()
          }
          isLoading={isPending}
          className="flex-1"
        >
          Add Link
        </Button>
      </div>
    </form>
  );
};

export default AddReadingLinkForm;
