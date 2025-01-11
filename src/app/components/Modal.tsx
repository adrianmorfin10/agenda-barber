// SuccessModal.tsx

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  buttons?: boolean
  content: string;
  title: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, content, title, buttons = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-center text-lg font-semibold text-black">{title}</h2>
        <p className="text-center text-sm text-black mt-2">{content}</p>
        {
          buttons &&
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
        }
      </div>
    </div>
  );
};

export default Modal;
