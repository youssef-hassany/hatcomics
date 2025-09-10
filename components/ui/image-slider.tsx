import React from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: string[];
  initialSlide?: number;
}

export const ImageSliderModal: React.FC<ImageSliderModalProps> = ({
  isOpen,
  onClose,
  attachments,
  initialSlide = 0,
}) => {
  if (
    typeof window === "undefined" ||
    !attachments ||
    attachments.length === 0
  ) {
    return null;
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "visible bg-black/90" : "invisible bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full h-full max-w-6xl max-h-[90vh] mx-4 transform transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Counter */}
        {attachments.length > 1 && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
            <span id="current-slide">1</span> / {attachments.length}
          </div>
        )}

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{
            el: ".swiper-pagination-custom",
            clickable: true,
            bulletClass: "swiper-pagination-bullet-custom",
            bulletActiveClass: "swiper-pagination-bullet-active-custom",
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: false,
          }}
          initialSlide={initialSlide}
          spaceBetween={0}
          slidesPerView={1}
          loop={attachments.length > 1}
          className="w-full h-full"
          onSlideChange={(swiper) => {
            const currentSlideElement =
              document.getElementById("current-slide");
            if (currentSlideElement) {
              currentSlideElement.textContent = (
                swiper.realIndex + 1
              ).toString();
            }
          }}
        >
          {attachments.map((attachment, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center"
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={attachment}
                  alt={`Attachment ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {attachments.length > 1 && (
          <>
            <button className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <button className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Custom Pagination */}
        {attachments.length > 1 && (
          <div className="swiper-pagination-custom absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2"></div>
        )}

        <style jsx>{`
          .swiper-pagination-bullet-custom {
            width: 10px;
            height: 10px;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .swiper-pagination-bullet-active-custom {
            background-color: white;
            transform: scale(1.2);
          }

          .swiper-pagination-bullet-custom:hover {
            background-color: rgba(255, 255, 255, 0.8);
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
};
