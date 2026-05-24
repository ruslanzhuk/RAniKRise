interface Props {
  label: string;
  value: string | number;
}

const StatCard = ({ label, value }: Props) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
