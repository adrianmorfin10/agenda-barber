// SuccessModal.tsx

import React from 'react';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content: string;
  title: string
}

const WarningModal: React.FC<WarningModalProps> = ({ isOpen, onClose, onConfirm, content, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-center text-lg font-semibold text-black">{title}</h2>
        <p className="text-center text-sm text-black mt-2">{content}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="bg-black text-white rounded-lg p-2 w-24 hover:bg-gray-800"
            onClick={onConfirm}
          >
            Aceptar
          </button>
          <button
            className="border border-gray-400 text-black p-2 w-24  rounded hover:border-gray-800"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
