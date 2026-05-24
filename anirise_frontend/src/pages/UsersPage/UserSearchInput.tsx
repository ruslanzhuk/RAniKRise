import React from "react";

type Props = {
  query: string;
  onChange: (value: string) => void;
};

const UserSearchInput: React.FC<Props> = ({ query, onChange }) => {
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search users..."
      className="w-full p-2 mb-4 border rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-accent
                 bg-surface text-main border-transparent
                 placeholder:text-secondary"
    />
  );
};

export default UserSearchInput;
