import { Link } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  to: string;
}

const QuickActionCard = ({ title, description, to }: Props) => {
  return (
    <Link
      to={to}
      className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-yellow-400 transition"
    >
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
};

export default QuickActionCard;