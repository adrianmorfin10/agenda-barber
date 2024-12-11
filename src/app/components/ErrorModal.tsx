// ErrorModal.tsx

import React from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  errorMessage: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, errorMessage, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-center text-lg font-semibold text-black">¡Error!</h2>
        <p className="text-center text-sm text-black mt-2">{errorMessage}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="bg-black text-white rounded-lg p-2 w-24 hover:bg-gray-800"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
