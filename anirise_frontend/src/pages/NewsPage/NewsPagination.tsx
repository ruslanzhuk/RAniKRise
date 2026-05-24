import React from "react";

type Props = {
  page: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
};

const NewsPagination: React.FC<Props> = ({ page, onPageChange, hasNext }) => {
  return (
    <div className="flex justify-center items-center mt-6 gap-3">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-main disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-main">{page}</span>
      <button
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-main disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default NewsPagination;
