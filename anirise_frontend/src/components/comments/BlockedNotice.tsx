import React from "react";

const BlockedNotice = () => {
  return (
    <div className="bg-red-900/40 border border-red-600 rounded-lg p-4 text-sm text-red-300">
      <p className="font-semibold mb-1">
        🚫 You are blocked
      </p>
      <p>
        You are not allowed to write comments or replies.
        <br />
        Please contact support if you believe this is a mistake.
      </p>
    </div>
  );
};

export default BlockedNotice;
