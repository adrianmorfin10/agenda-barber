// SuccessModal.tsx

import React, { useState } from 'react';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (raitng:number) => void;
}

const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [rating, setRating] = useState<number | null>(null);
  if (!isOpen) return null;
  const handleRating = (rate: number) => {
    setRating(rate);
  };

  
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 className="text-center text-lg font-semibold text-black">Encuesta</h2>
      <p className="text-center text-sm text-black mt-2">¿Cómo calificarías nuestro servicio?</p>
      <div className="flex justify-center gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((rate) => (
          <span
            key={rate}
            className={`cursor-pointer text-2xl ${rating === rate ? 'text-yellow-500 shadow-lg' : 'text-gray-400'}`}
            onClick={() => handleRating(rate)}
            style={{borderRadius: '50%'}}
          >
            {rate === 1 ? '😡' : rate === 2 ? '😟' : rate === 3 ? '😐' : rate === 4 ? '😊' : '😍'}
          </span>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="border border-gray-400 text-black p-2 w-24 rounded hover:border-gray-800"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className="bg-black text-white rounded-lg p-2 w-24 hover:bg-gray-800"
          onClick={()=>onConfirm(rating || 1)}
          disabled={rating === null}
        >
          Aceptar
        </button>
      </div>
    </div>
  </div>
  );
};

export default SurveyModal;
