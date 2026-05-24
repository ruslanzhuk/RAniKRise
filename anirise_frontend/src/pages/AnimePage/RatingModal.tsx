import { X } from "lucide-react";

interface Props {
  currentRating: number | null;
  onSelect: (score: number) => void;
  onClose: () => void;
}

const RatingModal = ({ currentRating, onSelect, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl p-6 w-[320px] animate-scaleIn">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Your rating</h3>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Rating buttons */}
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => {
            const active = currentRating === score;

            return (
              <button
                key={score}
                onClick={() => onSelect(score)}
                className={`
                  py-2 rounded-lg text-sm font-semibold
                  transition-all duration-200
                  ${
                    active
                      ? "bg-purple-600 text-white scale-105"
                      : "bg-gray-700 text-gray-300 hover:bg-purple-500 hover:text-white"
                  }
                `}
              >
                {score}
              </button>
            );
          })}
        </div>

        {currentRating && (
          <button
            onClick={() => onSelect(currentRating)}
            className="mt-4 w-full text-sm text-red-400 hover:text-red-300"
          >
            Remove rating
          </button>
        )}
      </div>
    </div>
  );
};

export default RatingModal;
