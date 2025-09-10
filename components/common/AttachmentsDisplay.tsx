import React, { useState } from "react";
import { ImageSliderModal } from "../ui/image-slider";

const AttachmentsDisplay = ({ attachments }: { attachments: string[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const openModal = (slideIndex: number = 0) => {
    setInitialSlide(slideIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const attachmentCount = attachments.length;

  // Single image layout
  if (attachmentCount === 1) {
    return (
      <>
        <div
          className="mt-3 rounded-2xl overflow-hidden border border-zinc-700 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openModal(0)}
        >
          <img
            src={attachments[0]}
            alt="Attachment"
            className="w-full max-h-96 object-cover"
          />
        </div>
        <ImageSliderModal
          isOpen={isModalOpen}
          onClose={closeModal}
          attachments={attachments}
          initialSlide={initialSlide}
        />
      </>
    );
  }

  // Two images layout
  if (attachmentCount === 2) {
    return (
      <>
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-zinc-700">
          {attachments.slice(0, 2).map((attachment, index) => (
            <img
              key={index}
              src={attachment}
              alt={`Attachment ${index + 1}`}
              className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openModal(index)}
            />
          ))}
        </div>
        <ImageSliderModal
          isOpen={isModalOpen}
          onClose={closeModal}
          attachments={attachments}
          initialSlide={initialSlide}
        />
      </>
    );
  }

  // Three images layout
  if (attachmentCount === 3) {
    return (
      <>
        <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-700">
          <div className="grid grid-cols-2 gap-1">
            <img
              src={attachments[0]}
              alt="Attachment 1"
              className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openModal(0)}
            />
            <div className="grid gap-1">
              <img
                src={attachments[1]}
                alt="Attachment 2"
                className="w-full h-24 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openModal(1)}
              />
              <img
                src={attachments[2]}
                alt="Attachment 3"
                className="w-full h-24 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openModal(2)}
              />
            </div>
          </div>
        </div>
        <ImageSliderModal
          isOpen={isModalOpen}
          onClose={closeModal}
          attachments={attachments}
          initialSlide={initialSlide}
        />
      </>
    );
  }

  // Four or more images layout
  if (attachmentCount >= 4) {
    return (
      <>
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-zinc-700">
          {attachments.slice(0, 4).map((attachment, index) => (
            <div key={index} className="relative">
              <img
                src={attachment}
                alt={`Attachment ${index + 1}`}
                className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openModal(index)}
              />
              {/* Show +X overlay on last image if there are more than 4 */}
              {index === 3 && attachmentCount > 4 && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-opacity-70 transition-all"
                  onClick={() => openModal(3)}
                >
                  <span className="text-white text-lg font-semibold">
                    +{attachmentCount - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <ImageSliderModal
          isOpen={isModalOpen}
          onClose={closeModal}
          attachments={attachments}
          initialSlide={initialSlide}
        />
      </>
    );
  }

  return null;
};

export default AttachmentsDisplay;
