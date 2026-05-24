import React, { useEffect, useRef, useState } from "react";
import { updateAvatar } from "../../api/userApi";
import { getCroppedImg } from "../../utils/cropImage";

type Crop = {
  x: number;
  y: number;
  size: number;
};

const AvatarSettings: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0, size: 100 });
  const [loading, setLoading] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    const size = Math.min(img.width, img.height) * 0.7;

    setImageSize({ width: img.width, height: img.height });
    setCrop({
      size,
      x: (img.width - size) / 2,
      y: (img.height - size) / 2,
    });
  }, [imageSrc]);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    start.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;

    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;

    setCrop((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(prev.x + dx, imageSize.width - prev.size)),
      y: Math.max(0, Math.min(prev.y + dy, imageSize.height - prev.size)),
    }));

    start.current = { x: e.clientX, y: e.clientY };
  };

  const stopDragging = () => {
    dragging.current = false;
  };

  const handleSave = async () => {
    if (!imageSrc) return;

    setLoading(true);

    try {
      const base64 = await getCroppedImg(imageSrc, {
        x: crop.x,
        y: crop.y,
        width: crop.size,
        height: crop.size,
      });

      await updateAvatar({
        AvatarUrl: base64.split(",")[1],
        CropX: Math.round(crop.x),
        CropY: Math.round(crop.y),
        CropWidth: Math.round(crop.size),
        CropHeight: Math.round(crop.size),
      });

      alert("Avatar successfully updated!");
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      alert("Avatar upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-2xl
                      shadow-xl space-y-6 animate-fade-in">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold">Update avatar</h2>
          <p className="text-sm text-gray-400 mt-1">
            Upload an image, crop the visible area and save your new avatar.
          </p>
        </div>

        {/* UPLOAD */}
        {!imageSrc && (
          <label className="group block border-2 border-dashed border-gray-600
                            rounded-xl p-8 text-center cursor-pointer
                            hover:border-purple-500 transition">
            <p className="text-sm text-gray-300 group-hover:text-white">
              Click to upload an image
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG or PNG — square images work best
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        )}

        {/* CROP */}
        {imageSrc && (
          <>
            <p className="text-xs text-gray-400 text-center">
              Drag the square to adjust visible area
            </p>

            <div
              className="relative select-none"
              onMouseMove={onMouseMove}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt=""
                className="max-w-full rounded-lg"
                draggable={false}
              />

              {/* DARK MASK */}
              <div className="absolute inset-0 bg-black/50 pointer-events-none" />

              {/* CROP BOX */}
              <div
                onMouseDown={onMouseDown}
                className="absolute border-2 border-purple-500
                          rounded-lg cursor-move
                          ring-2 ring-purple-500/30
                          transition-all duration-75"
                style={{
                  left: crop.x,
                  top: crop.y,
                  width: crop.size,
                  height: crop.size,
                }}
              />
            </div>

            {/* SIZE SLIDER */}
            <div>
              <label className="text-sm text-gray-400 flex justify-between">
                Crop size
                <span className="text-xs text-gray-500">
                  {Math.round(crop.size)} px
                </span>
              </label>
              <input
                type="range"
                min={50}
                max={Math.min(imageSize.width, imageSize.height)}
                value={crop.size}
                onChange={(e) =>
                  setCrop((c) => ({ ...c, size: Number(e.target.value) }))
                }
                className="w-full accent-purple-500"
              />
            </div>

            {/* SAVE */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-purple-600 py-2 rounded-lg
                         hover:bg-purple-700 active:scale-[0.98]
                         transition disabled:opacity-50"
            >
              {loading ? "Saving avatar..." : "Save avatar"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarSettings;
