import { MediaType } from "../../../../api/types/adminAll.types";

interface Props {
  value: MediaType;
  onChange: (type: MediaType) => void;
}

const MediaTypeSelect: React.FC<Props> = ({ value, onChange }) => {
  return (
    <select
      className="border px-2 py-1 rounded"
      value={value}
      onChange={(e) => onChange(e.target.value as MediaType)}
    >
      {Object.values(MediaType).map((type) => (
        <option key={type} value={type}>
          {type.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
};

export default MediaTypeSelect;
