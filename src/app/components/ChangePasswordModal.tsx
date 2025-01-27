// SuccessModal.tsx

import React, { useState } from 'react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirm:boolean) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onConfirm }) => {
 
    const [ passowrd, setPassword ] = React.useState('');

    if (!isOpen) return null;
  
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-center text-lg font-semibold text-black">Cambiar contraseña</h2>
            
                <div className="flex flex-col justify-center gap-2 mt-4">
                    <label className="block text-black text-sm font-medium mb-1">Nueva contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={''}
                        onChange={(e)=>{ }}
                        className="border p-2 w-full rounded placeholder-gray-600 text-black focus:border-black"
                        placeholder="Escriba la contraseña"
                    />
                </div>
                <div className="flex flex-col justify-center gap-2 mt-4">
                    <label className="block text-black text-sm font-medium mb-1">Repita la contraseña</label>
                    <input
                        type="password"
                        name="password_confirm"
                        value={''}
                        onChange={(e)=>{ }}
                        className="border p-2 w-full rounded placeholder-gray-600 text-black focus:border-black"
                        placeholder="Escriba la confirmacion de la nueva contraseña"
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
                        onClick={()=>{}}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
