export interface Sucursal {
    id?: number;
    nombre: string;
    direccion: string;
    encargado: string;
  }
  
export interface SucursalModalProps {
    sucursalSeleccionada: Sucursal;
    sucursales: Sucursal[];
    onSelect: (sucursal: Sucursal) => void;
    onAddSucursal: (sucursal: Sucursal) => void;
    onClose: () => void;
  }