// Al final de tu archivo
declare module 'react-big-calendar' {
    import { ComponentType } from 'react';
  
    const Calendar: ComponentType<any>; // 'Calendar' es el export por defecto
    export const dateFnsLocalizer: any;
    export const Views: any;
    export const momentLocalizer: any;
  
    export default Calendar; // Usamos export default aquí
  }
  