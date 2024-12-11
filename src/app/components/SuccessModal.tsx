// SuccessModal.tsx

import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-center text-lg font-semibold text-black">¡Éxito!</h2>
        <p className="text-center text-sm text-black mt-2">El cliente ha sido añadido correctamente.</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="bg-black text-white rounded-lg p-2 w-24 hover:bg-gray-800"
            onClick={onConfirm}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
