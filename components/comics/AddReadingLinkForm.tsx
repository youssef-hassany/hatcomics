"use client";

import { useAddReadingLink } from "@/hooks/comics/useAddReadingLink";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

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

  const [readingLink, setReadingLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addLink({ comicId, readingLink });
      toast.success("Reading Link added to the comic!");
      onSuccess();
    } catch (error) {
      toast.error("Something went wrong, try again");
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReadingLink(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-10 p-6 rounded-xl shadow space-y-6"
    >
      <h1 className="text-2xl font-bold">Add Reading Link</h1>

      <div className="space-y-2">
        <label className="block font-medium">
          Reading Link <span className="text-red-500">*</span>
        </label>
        <input
          name="readingLink"
          value={readingLink}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Enter reading link URL"
          required
        />
      </div>

      <div className="flex space-x-4">
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
          disabled={!readingLink.trim()}
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
