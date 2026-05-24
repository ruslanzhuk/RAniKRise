interface Props {
  bio?: Record<string, string>;
}

const CharacterBio: React.FC<Props> = ({ bio }) => {
  if (!bio || Object.keys(bio).length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Biography
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-300 text-sm">
        {Object.entries(bio).map(([key, value]) => (
          <p key={key}>
            <span className="text-gray-500">{key}:</span> {value || "N/A"}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CharacterBio;
