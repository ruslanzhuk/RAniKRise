import { MediaDto, MediaType } from "../../../../api/types/adminAll.types";
import MediaPreview from "./MediaPreview";
import MediaTypeSelect from "./MediaTypeSelect";
import { deleteMedia, updateMediaType } from "../../../../api/adminApi";

interface Props {
  media: MediaDto[];
  onRefresh: () => void;
}

const MediaTable: React.FC<Props> = ({ media, onRefresh }) => {
  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th>Preview</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {media.map((m) => (
          <tr key={m.id} className="border-t">
            <td className="p-2">
              <MediaPreview media={m} />
            </td>
            <td className="p-2">
              <MediaTypeSelect
                value={m.type}
                onChange={async (type: MediaType) => {
                  await updateMediaType(m.id, type);
                  onRefresh();
                }}
              />
            </td>
            <td className="p-2">
              <button
                onClick={async () => {
                  await deleteMedia(m.id);
                  onRefresh();
                }}
                className="text-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MediaTable;
