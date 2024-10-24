import React, { useState } from 'react';

interface AddClientFormProps {
  isOpen: boolean;
  handleClose: () => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({ isOpen, handleClose }) => {
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    // Aquí puedes manejar la lógica para guardar los datos del nuevo cliente
    console.log({ phone, firstName, lastName, email });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold">Añadir nuevo cliente</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>
        <div className="p-2">
          <div className="mb-4">
            <input type="text" placeholder='Número de teléfono' value={phone} onChange={handlePhoneChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
          <div className="mb-4">
            <input type="text" placeholder='Nombre' value={firstName} onChange={handleFirstNameChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
          <div className="mb-4">
            <input type="text" placeholder='Apellido' value={lastName} onChange={handleLastNameChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
          <div className="mb-4">
            <input type="email" placeholder='Correo electrónico' value={email} onChange={handleEmailChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
          <div className="flex justify-center">
            <button onClick={handleSubmit} className="bg-black text-white p-2 rounded w-full">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClientForm;
