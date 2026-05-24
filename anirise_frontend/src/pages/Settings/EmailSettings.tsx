import React, { useEffect, useState } from "react";
import {
  requestEmailChange,
  confirmEmailChange,
  getEmailChangeStatus,
  cancelEmailChange,
} from "../../api/userApi";

type Status = { type: "success" | "error"; message: string } | null;
type Step = "request" | "confirm-old" | "confirm-new";

const EmailSettings: React.FC = () => {
  const [newEmail, setNewEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<Step>("request");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const res = await getEmailChangeStatus();

        if (!res.inProgress || res.step === "none") {
          setStep("request");
          return;
        }

        setStep(res.step);

        if (res.pendingEmail) {
          setNewEmail(res.pendingEmail);
        }
      } catch {
        setStep("request");
      }
    };

    loadStatus();
  }, []);

  // === STEP 1: request email change ===
  const handleRequest = async () => {
    setLoading(true);
    setStatus(null);

    try {
      await requestEmailChange(newEmail);
      setStep("confirm-old");
      setStatus({
        type: "success",
        message: "Confirmation code sent to your current email.",
      });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to request email change.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    setLoading(true);
    setStatus(null);

    try {
      await cancelEmailChange();

      setStep("request");
      setNewEmail("");
      setToken("");

      setStatus({
        type: "success",
        message: "Email change process has been reset. You can start again."
      });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to reset email change process."
      });
    } finally {
      setLoading(false);
    }
  };

  // === STEP 2 & 3: confirm codes ===
  const handleConfirm = async () => {
    setLoading(true);
    setStatus(null);

    try {
      await confirmEmailChange(token);

      if (step === "confirm-old") {
        setStep("confirm-new");
        setToken("");
        setStatus({
          type: "success",
          message: "Old email confirmed. Code sent to new email.",
        });
      } else {
        setStep("request");
        setNewEmail("");
        setToken("");
        setStatus({
          type: "success",
          message: "Email successfully updated!",
        });
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.message || "Invalid or expired confirmation code.",
      });
    } finally {
      setLoading(false);
    }
  };

  const stepDescription = {
    request:
      "Enter a new email address. A confirmation code will be sent to your current email.",
    "confirm-old":
      "Enter the code sent to your current email to verify ownership.",
    "confirm-new":
      "Enter the code sent to your new email to complete the change.",
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 text-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">
        Email Settings
      </h2>

      {/* STEP INDICATOR */}
      <div className="flex items-center space-x-2 text-sm">
        {["request", "confirm-old", "confirm-new"].map((s, i) => (
          <React.Fragment key={s}>
            <span
              className={`font-semibold ${
                step === s ? "text-purple-400" : "text-gray-500"
              }`}
            >
              {i + 1}
            </span>
            {i < 2 && <span className="text-gray-500">→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* STATUS */}
      {status && (
        <div
          className={`p-2 rounded ${
            status.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {status.message}
        </div>
      )}

      <p className="text-sm text-gray-400">{stepDescription[step]}</p>

      {/* STEP 1 */}
      {step === "request" && (
        <div className="space-y-4">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New email"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleRequest}
            disabled={loading || !newEmail.trim()}
            className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send confirmation code"}
          </button>
        </div>
      )}

      {/* STEP 2 & 3 */}
      {(step === "confirm-old" || step === "confirm-new") && (
        <div className="space-y-4">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Confirmation code"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleConfirm}
            disabled={loading || !token.trim()}
            className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading
              ? "Confirming..."
              : step === "confirm-old"
              ? "Confirm old email"
              : "Confirm new email"}
          </button>
        </div>
      )}
      {step !== "request" && (
      <button
        onClick={handleRestart}
        disabled={loading}
        className="text-sm text-red-400 hover:text-red-300 underline disabled:opacity-50"
      >
        Start over (reset email change)
      </button>
    )}
    </div>
  );
};

export default EmailSettings;
