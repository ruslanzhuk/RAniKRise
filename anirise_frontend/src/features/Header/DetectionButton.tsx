import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface DetectionButtonProps {
  children: ReactNode;
  onClick: () => void;
}

const DetectionButton: React.FC<DetectionButtonProps> = ({ children, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      whileHover={{
        scale: 1.08,
        boxShadow: "0 0 12px rgba(119, 70, 224, 0.6)",
        backgroundColor: "rgba(53, 183, 223, 0.2)",
        transition: {
          scale: { type: "spring", stiffness: 300, damping: 20 },
          backgroundColor: { duration: 0.2 }
        }
      }}
      whileTap={{ scale: 0.95 }}
      className="ml-4 px-3 py-1.5 border border-purple-600 text-purple-400 rounded-md text-xs font-semibold tracking-wide uppercase select-none"
    >
      {children}
    </motion.button>
  );
};

export default DetectionButton;
