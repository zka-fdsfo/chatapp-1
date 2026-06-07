import React from "react";
import { X, Download } from "lucide-react";

const ImageViewer = ({ image, onClose }) => {
  if (!image) return null;

  const playSound = () => {
    const audio = new Audio("/click.mp3"); // put any click sound in public folder
    audio.play();
  };

  const handleClose = () => {
    playSound();
    onClose();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "image.jpg";
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/95 flex flex-col"
      onClick={handleClose}
    >
      {/* TOP BAR */}
      <div className="flex justify-end items-center gap-4 p-4 text-white">
        <button onClick={handleDownload}>
          <Download size={20} />
        </button>

        <button onClick={handleClose}>
          <X size={22} />
        </button>
      </div>

      {/* IMAGE */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={image}
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default ImageViewer;