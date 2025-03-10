"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ClientService from '../services/ClientService';
import {Empleado} from '../interfaces/empleado';
import EmpleadoService from '../services/EmpleadoService';
import MembresiaService from '../services/MembresiaService';
import { AppContext } from "../components/AppContext";
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import { get } from 'http';
const clientService = new ClientService();
const empleadoServiceObject = new EmpleadoService();
const membresiaServiceObject = new MembresiaService();

interface AddUserModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onCreateSuccess?: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isModalOpen, setIsModalOpen, onCreateSuccess }) => {
  const [state, dispatchState] = React.useContext(AppContext);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [membresias, setMembresias] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    instagram: '',
    descuento: 0,
    creado_por: 0,
    membresia: false,
    avatar: false,
    foto: null as File | null,
    membresia_id: 0
  });

  React.useEffect(()=>{
    getEmpleados();
    getMembresias();
  }, [state.sucursal])

  const getEmpleados = ()=>{
    empleadoServiceObject.getEmpleados(state.sucursal ? { local_id: state.sucursal.id } : false).then(response=>{
      const _empleados = response.map((item:any)=>{
        const { reservacions } = item;
        const canceladas = reservacions.filter((item:any)=>item.state === "cancel");
        const insistidas = reservacions.filter((item:any)=>item.state === "inasistsida");
        return {
          id: item.id,
          nombre: item.usuario.nombre,
          apellido: item.usuario.apellido_paterno,
          telefono: item.usuario.telefono,
          email: item.usuario.email,
          instagram: '',
          citas: reservacions?.length || 0,
          inasistencias: insistidas?.length || 0,
          cancelaciones: canceladas?.length || 0,
          ultimaVisita: reservacions.length ? new Date(reservacions[0].fecha).toLocaleString() : '',
          //falta guardar el costo de la reservacion para calcular esto
          ingresosTotales: 0,
          tipo: 'Black',
          diasTrabajo: item.working_days || [],
          servicios: item.working_days || [],
          //Especificar q es proximo pago
          proximoPago: '',
      }
      })
      setEmpleados(_empleados);
    }).catch(e=>{})
  }
  const getMembresias = ()=>{
    membresiaServiceObject.getMembresias(state.sucursal ? { local_id: state.sucursal.id } : false).then(response=>{
      setMembresias(response);
    }).catch(e=>{})
  }

  React.useEffect(()=>{
    if(state.sucursal)
      getEmpleados();
  }, [state.sucursal])
  

  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoCliente({ ...nuevoCliente, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if(selectedFile){
      const reader = new FileReader(); //Leemos el contenido
    
      reader.onload = function(e) { //Al cargar el contenido lo pasamos como atributo de la imagen de arriba
        const imgElement = document.getElementById('image_preview') as HTMLImageElement;
        if (imgElement) {
          imgElement.src = e.target?.result as string;
        }
      }
      
      reader.readAsDataURL(selectedFile);
    }
    setFile(selectedFile);
  };

  const handleAddCliente = () => {

    if (!nuevoCliente.creado_por) { // Validación de empleado seleccionado
      setErrorMessage('Debe seleccionar un empleado.');
      setErrorModalOpen(true);
      return;
    }
  
    const clientService = new ClientService();

    const formData = new FormData();
    formData.append('nombre', nuevoCliente.nombre);
    formData.append('apellido', nuevoCliente.apellido);
    formData.append('telefono', nuevoCliente.telefono);
    formData.append('email', nuevoCliente.email);
    formData.append('instagram', nuevoCliente.instagram);
    formData.append('descuento', nuevoCliente.descuento.toString());
    formData.append('membresia', nuevoCliente.membresia.toString());
    formData.append('creado_por', nuevoCliente.creado_por.toString());
    formData.append('local_id', state?.sucursal.id.toString());
    if (file) {
      formData.append('foto', file);
    }
  
    clientService.createClient(formData)
      .then((response) => {
        setNuevoCliente({
          nombre: '',
          apellido: '',
          telefono: '',
          email: '',
          instagram: '',
          descuento: 0,
          membresia: false,
          creado_por: 0,
          foto: null,
          membresia_id: 0,
          avatar: false
        });
        setFile(null);
        setSuccessModalOpen(true);
        if (typeof onCreateSuccess === "function") onCreateSuccess();
        setIsModalOpen(false);
      })
      .catch((error) => {
        setErrorMessage('Ocurrió un error al añadir el cliente. Verifica si el correo electrónico ya existe.');
        setErrorModalOpen(true);
        console.error('Error al añadir cliente:', error);
      });
  };

  
  const handleImageUploadClick = () => {
    document.getElementById('fileInput')?.click(); // Simula un clic en el input de archivo
  };

  
  const handleDescuentoChange = (increment: boolean) => {
    setNuevoCliente((prev) => ({
      ...prev,
      descuento: increment ? Math.min(prev.descuento + 5, 100) : Math.max(prev.descuento - 5, 0),
    }));
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-y-0 right-0 md:w-[450px] w-full bg-white z-50 shadow-lg p-5 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center mb-4">
            <Image
              src="/img/closemodal.svg"
              alt="Cerrar"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            />
            <h2 className="text-lg font-semibold ml-2 text-[#0C101E]">Añadir Nuevo Usuario</h2>
          </div>
          {/* Campos del formulario */}
          <div className="mb-4">
            <div className='mb-4 flex'>
              <div className="mr-4 flex-grow">
                <label className="block mb-1 text-[#858585] text-sm md:text-[12px] font-light">Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={nuevoCliente.nombre}
                  onChange={handleInputChange}
                  className="border p-2 mb-2 rounded-lg text-black placeholder-gray w-full"
                  maxLength={50}
                  required
                />
                <label className="block mb-1 text-[#858585] text-sm md:text-[12px] font-light">Apellido:</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={nuevoCliente.apellido}
                  onChange={handleInputChange}
                  className="border p-2 rounded-lg text-black placeholder-gray w-full"
                  maxLength={50}
                  required
                />
              </div>
              <div className="flex flex-col items-center justify-center border border-dashed border-[#CACACA] p-2 rounded-[5px] w-36 h-[136px]">
                {file ? 
                (
                  <>
                    <Image
                      id="image_preview"
                      src={''}
                      alt="Vista previa de la imagen"
                      width={50}
                      height={50}
                      className="mt-2"
                    />
                    <p
                      className="text-xs text-blue-600 cursor-pointer mt-1"
                      onClick={handleImageUploadClick} // Permite volver a cargar la imagen
                    >
                      Reemplazar imagen
                    </p>
                  </>
                ) : (
                  <div
                    className="flex items-center justify-center w-full h-full cursor-pointer"
                    onClick={handleImageUploadClick}
                  >
                    <Image
                      src="/img/foto.svg" // Cambia esta ruta a la ubicación del icono de carga
                      alt="Cargar Foto"
                      width={50}
                      height={50}
                      className="cursor-pointer"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="fileInput"
                  className="hidden"
                />
              </div>
              
            </div>
            
          </div>
          {/* Resto del formulario */}
          <input
            type="tel"
            name="telefono"
            placeholder="Número de Teléfono"
            value={nuevoCliente.telefono}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Solo números
              setNuevoCliente({ ...nuevoCliente, telefono: value });
            }}
            className="border p-2 mb-2 w-full rounded-lg text-black placeholder-gray"
            maxLength={50}
            required
          />
          <select
            name="creado_por"
            value={nuevoCliente.creado_por}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, creado_por: parseInt(e.target.value) })}
            className="border p-2 mb-2 w-full rounded-lg text-black placeholder-gray"
            required
          >
            <option value="">Seleccione un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.id}>
                {empleado.nombre} {empleado.apellido}
              </option>
            ))}
          </select>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={nuevoCliente.email}
              onChange={handleInputChange}
              className="border p-2 mb-2 w-full rounded-lg text-black placeholder-gray"
              maxLength={50}
              required
            />
            {
              nuevoCliente.email.length > 2 && (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(nuevoCliente.email)) &&
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Este email no tiene un formato valido</p>
              </div>
            }
          </div>
          <input
            type="text"
            name="instagram"
            placeholder="Usuario de Instagram (opcional)"
            value={nuevoCliente.instagram}
            onChange={handleInputChange}
            className="border p-2 mb-4 w-full rounded-lg text-black placeholder-gray"
            maxLength={50}
          />

          {/* Contenedor de Descuento y Membresía */}
          <div className="flex flex-col md:flex-row gap-5 justify-between items-center mb-4">
            {/* Sección de Descuento */}
            <div className="w-full">
              <label className="block mb-1 text-[#858585] text-sm md:text-[12px] font-light">Descuento:</label>
              <div className="border rounded-lg flex items-center">
                <button
                  className={`px-4 flex justify-center ${nuevoCliente.descuento === 0 ? 'opacity-50' : ''}`}
                  onClick={() => handleDescuentoChange(false)}
                  disabled={nuevoCliente.descuento === 0}
                >
                  <Image
                    src="/img/minus.svg"
                    alt="Decrementar"
                    width={20}
                    height={20}
                    style={nuevoCliente.descuento === 0 ? { filter: 'grayscale(100%)' } : {}}
                  />
                </button>
                <input
                  type="number"
                  value={nuevoCliente.descuento}
                  readOnly
                  className="p-2 text-center text-black placeholder-gray w-full"
                  style={{ flex: 1 }}
                />
                <button
                  className={`px-4 flex justify-center ${nuevoCliente.descuento === 100 ? 'opacity-50' : ''}`}
                  onClick={() => handleDescuentoChange(true)}
                  disabled={nuevoCliente.descuento === 100}
                >
                  <Image
                    src="/img/mas.svg"
                    alt="Incrementar"
                    width={20}
                    height={20}
                    style={nuevoCliente.descuento === 100 ? { filter: 'grayscale(100%)' } : {}}
                  />
                </button>
              </div>
            </div>

            {/* Sección de Membresía */}
            <div className="w-full">
              <label className="block mb-1 text-[#858585] text-sm md:text-[12px] font-light">¿Agregar Membresía?</label>
              <div className="flex items-center px-2 py-2">
                <button
                  className={`w-10 h-5 flex items-center rounded-full p-1 ${nuevoCliente.membresia ? 'bg-green-500' : 'bg-gray-300'}`}
                  onClick={() => setNuevoCliente({ ...nuevoCliente, membresia: !nuevoCliente.membresia })}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${nuevoCliente.membresia ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </div>
           
          </div>
          
          {/* Botón Añadir Cliente */}
          <button
            className="bg-[#0C101E] text-white rounded-lg p-2 w-full hover:bg-[#000000] mt-auto"
            onClick={handleAddCliente}
          >
            Añadir Cliente
          </button>
        </div>
      )}

      {/* Modales */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        onConfirm={() => setSuccessModalOpen(false)}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        errorMessage={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </>
  );
};

export default AddUserModal;
