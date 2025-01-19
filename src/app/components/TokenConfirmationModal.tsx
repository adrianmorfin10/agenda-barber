// SuccessModal.tsx

import React, { useState } from 'react';

interface TokenConfirmationModalProps {
  isOpen: boolean;
  token: string | null;
  onClose: () => void;
  onConfirm: (confirm:boolean) => void;
}

const TokenConfirmationModal: React.FC<TokenConfirmationModalProps> = ({ isOpen, token, onClose, onConfirm }) => {
 
  const [ tokenInput, setTokenInput ] = React.useState('');

  const confirmToken = ()=>{
   
    if(token === tokenInput){
      onConfirm(true, );
      return;
    }
    alert('El token proporciondo por el usuario y el enviado no coinciden')
  }

  React.useEffect(()=>{

    setTokenInput('');
  },[isOpen])

  if (!isOpen) return null;
  
  if(!token)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-center text-lg font-semibold text-black">Confirmacion del token</h2>
          <p className="text-center text-sm text-black mt-2">No hay token a verificar</p>
        </div>
      </div>
    )
  
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 className="text-center text-lg font-semibold text-black">Confirmacion del token</h2>
      <p className="text-center text-sm text-black mt-2">Ingrese el token de confirmacion de la cita</p>
      <div className="flex flex-col justify-center gap-2 mt-4">
        <label className="block text-black text-sm font-medium mb-1">Token</label>
        <input
          type="number"
          name="token"
          value={tokenInput}
          onChange={(e)=>{ setTokenInput(e.target.value)}}
          className="border p-2 w-full rounded placeholder-gray-600 text-black focus:border-black"
          placeholder="Escriba el token proporcionado por el cliente"
        />
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
          onClick={confirmToken}
        >
          Aceptar
        </button>
      </div>
    </div>
    </div>
  );
};

export default TokenConfirmationModal;
