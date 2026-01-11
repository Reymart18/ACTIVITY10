import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function MessageBox({
  type = "success",
  message,
  duration = 3000,   // auto-close duration
  onClose,
  onConfirm,
  isConfirm = false, // confirm modal flag
  persistent = false // keeps toast always visible
}) {
  const [visible, setVisible] = useState(true);

  // Auto-close only if not confirm and not persistent
  useEffect(() => {
    if (!isConfirm && !persistent) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, isConfirm, persistent]);

  if (!visible) return null;

  // ================= CONFIRM BOX =================
  if (isConfirm) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 dark:bg-gray-900 dark:bg-opacity-50">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-2xl p-6 w-80">
          <p
            className={`text-lg font-semibold mb-4 ${
              type === "success" ? "text-green-700" :
              type === "error" ? "text-red-700" :
              "text-gray-800 dark:text-gray-100"
            }`}
          >
            {message}
          </p>
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => { setVisible(false); if (onClose) onClose(); }}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-500 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            >
              No
            </button>
            <button
              onClick={() => { setVisible(false); if (onConfirm) onConfirm(); }}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= TOAST BOX =================
  const bgColor =
    type === "success" ? "bg-green-100 dark:bg-green-900" :
    type === "error" ? "bg-red-100 dark:bg-red-900" :
    "bg-blue-100 dark:bg-blue-900";

  const borderColor =
    type === "success" ? "border-green-500 dark:border-green-400" :
    type === "error" ? "border-red-500 dark:border-red-400" :
    "border-blue-500 dark:border-blue-400";

  const textColor =
    type === "success" ? "text-green-700 dark:text-green-300" :
    type === "error" ? "text-red-700 dark:text-red-300" :
    "text-blue-700 dark:text-blue-300";

  return (
    <div className={`fixed top-5 right-5 z-50 border-l-4 ${borderColor} ${bgColor} ${textColor} px-4 py-3 shadow-lg flex items-center space-x-2 rounded-md`}>
      <span className="flex-1">{message}</span>
      <button onClick={() => { setVisible(false); if (onClose) onClose(); }}>
        <X size={16} />
      </button>
    </div>
  );
}
