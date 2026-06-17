import React, { useRef, useState, useEffect } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const ImageViewer = ({ image, onClose }) => {
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(false);

  // Drag states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const imgRef = useRef(null);
 
  useEffect(() => {
    if (image) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [image]);

  if (!image) return null;

  const { name, avatar, createdAt, image: imgUrl } = image;

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleClose = () => {
    setVisible(false);

    setTimeout(() => {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      onClose();
    }, 250);
  };

  const handleDownload = (e) => {
    e.stopPropagation();

    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = "image.jpg";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const zoomIn = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.2, 5));
  };

  const zoomOut = (e) => {
    e.stopPropagation();

    setScale((prev) => {
      const next = Math.max(prev - 0.2, 0.5);

      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }

      return next;
    });
  };

  const handleWheel = (e) => {
    e.preventDefault();

    setScale((prev) => {
      const next =
        e.deltaY < 0
          ? Math.min(prev + 0.1, 5)
          : Math.max(prev - 0.1, 0.5);

      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }

      return next;
    });
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag functionality
  const handleMouseDown = (e) => {
    if (scale <= 1) return;

    e.preventDefault();

    setIsDragging(true);
    setStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      onClick={handleClose}
      style={{
        backgroundColor: `rgba(0,0,0,${visible ? 0.75 : 0})`,
        transition: "background-color 0.25s ease",
      }}
    >
      {/* HEADER */}
      <div
        className="h-[64px] px-5 flex items-center justify-between bg-black/60 p-3.5"
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <h3 className="text-white text-sm font-medium leading-none">
              {name}
            </h3>

            <p className="text-gray-400 text-xs mt-1">
              {formatTime(createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-white">
          <button onClick={handleDownload}>
            <Download size={20} />
          </button>

          <button onClick={zoomOut}>
            <ZoomOut size={20} />
          </button>

          <button onClick={zoomIn}>
            <ZoomIn size={20} />
          </button>

          <button onClick={handleClose}>
            <X size={22} />
          </button>
        </div>
      </div>

      {/* IMAGE AREA */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden bg-black/70"
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          ref={imgRef}
          src={imgUrl}
          alt="preview"
          draggable={false}
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
          className="object-contain select-none"
          style={{
            maxWidth: "75vw",
            maxHeight: "78vh",
            opacity: visible ? 1 : 0,
            transform: `
              translate(${position.x}px, ${position.y}px)
              scale(${visible ? scale : 0.85})
            `,
            cursor:
              scale > 1
                ? isDragging
                  ? "grabbing"
                  : "grab"
                : "default",
            transition: isDragging
              ? "none"
              : "opacity 0.25s ease, transform 0.25s ease",
          }}
        />
      </div>

      {/* ZOOM INDICATOR */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white text-sm px-4 py-1.5 rounded-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default ImageViewer;