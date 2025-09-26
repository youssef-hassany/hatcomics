import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Map, NewspaperIcon, Star } from "lucide-react";

const PointsInfoIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Info Icon Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-40 border-2 border-orange-300"
        title="How to earn points"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="text-3xl mb-2">⚡</div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 uppercase">
              How to Earn Points
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              Level up your hero status!
            </p>
          </div>

          {/* Points List */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg border-2 border-zinc-600">
              <div className="flex items-center space-x-3">
                <Star className="text-orange-500" />
                <span className="text-white font-bold">Write Review</span>
              </div>
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-black">
                +2 PTS
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg border-2 border-zinc-600">
              <div className="flex items-center space-x-3">
                <NewspaperIcon className="text-orange-500" />
                <span className="text-white font-bold">Create Post</span>
              </div>
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-black">
                +5 PTS
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg border-2 border-zinc-600">
              <div className="flex items-center space-x-3">
                <Map className="text-orange-500" />
                <span className="text-white font-bold">Create Roadmap</span>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-black animate-pulse">
                +10 PTS
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-zinc-600 hover:bg-zinc-500 text-white px-6 py-2 rounded-lg font-bold transition-colors duration-200"
          >
            Got it!
          </button>
        </div>
      </Modal>
    </>
  );
};

export default PointsInfoIcon;
