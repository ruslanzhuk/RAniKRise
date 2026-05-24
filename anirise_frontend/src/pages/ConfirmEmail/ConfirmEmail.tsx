import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ConfirmEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Confirming...");
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("No token provided");
      return;
    }

    const confirm = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/User/confirm-email?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Confirmation failed");

        setMessage("Email confirmed successfully!");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err: any) {
        setMessage(err.message || "Confirmation failed");
      }
    };

    confirm();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md text-center text-white">
        {message}
      </div>
    </div>
  );
};

export default ConfirmEmail;
