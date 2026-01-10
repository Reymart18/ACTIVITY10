// src/components/common/Modal.jsx
export default function Modal({ children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }
  