interface Props {
  total: number;
  page: number;
  pageSize: number;
  onChange: (p: number) => void;
}

const Pagination = ({ total, page, pageSize, onChange }: Props) => {
  const pages = Math.ceil(total / pageSize);

  if (pages <= 1) return null;

  return (
    <div className="flex gap-2 mt-6">
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded ${
            p === page ? "bg-indigo-600" : "bg-gray-700"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
