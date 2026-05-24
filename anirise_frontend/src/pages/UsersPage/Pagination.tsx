import React from "react";

type Props = {
  page: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
};

const Pagination: React.FC<Props> = ({ page, onPageChange, hasNext }) => {
  return (
    <div className="flex justify-center items-center mt-6 gap-3">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="
          px-4 py-2 rounded-lg
          bg-card text-main
          hover:bg-hoverbg
          disabled:opacity-50
          transition
        "
      >
        Prev
      </button>
      <span className="text-main font-medium">{page}</span>
      <button
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        className="
          px-4 py-2 rounded-lg
          bg-card text-main
          hover:bg-hoverbg
          disabled:opacity-50
          transition
        "
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
