"use client";

import React from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isOpen ? "visible bg-black/80" : "invisible bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-zinc-800 rounded-xl shadow-xl transform transition-all duration-200 max-w-lg w-full max-h-[80vh] overflow-y-scroll mx-4 p-6
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside modal
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
