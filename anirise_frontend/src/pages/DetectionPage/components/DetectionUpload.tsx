import React, { useState, ChangeEvent } from "react";
import { CharacterCardDTO } from "../../../api/types/ml";
import { detectCharacters } from "../../../api/detectionApi";

interface DetectionUploadProps {
  onDetectionStart: () => void;
  onDetectionComplete: (results: CharacterCardDTO[]) => void;
}

const DetectionUpload: React.FC<DetectionUploadProps> = ({
  onDetectionStart,
  onDetectionComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleDetect = async () => {
    if (!file) return;
    onDetectionStart();

    try {
      const results = await detectCharacters(file);
      onDetectionComplete(results);
    } catch (err) {
      console.error(err);
      onDetectionComplete([]);
    }
  };

  return (
    <div className="mb-6 flex gap-6 items-start">
      {/* Preview */}
      <div className="flex-shrink-0">
        <label
          htmlFor="fileInput"
          className="cursor-pointer block w-[450px] h-[450px] border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center bg-gray-900 hover:border-purple-500 transition"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <span className="text-gray-400 text-center p-4">
              Upload file for detection
            </span>
          )}
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Button */}
      <div className="flex-1 flex flex-col justify-center">
        <button
          onClick={handleDetect}
          disabled={!file}
          className="bg-purple-700 hover:bg-purple-600 transition text-white py-3 px-6 rounded-lg disabled:opacity-50 w-[200px]"
        >
          Detect
        </button>
        <p className="text-gray-400 text-sm mt-2">
          Supported formats: JPG, PNG, GIF. Make sure characters are clearly visible.
        </p>
      </div>
    </div>
  );
};

export default DetectionUpload;
