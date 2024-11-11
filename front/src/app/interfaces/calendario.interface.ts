<<<<<<< HEAD
export interface IEvento {
  id: number;
  calendario_id: number;
  fecha: string; // Usamos string para las fechas y horas, ya que vienen como strings del backend
  hora_inicio: string;
  hora_fin: string;
  estado: string;
}

export interface ICalendario {
  usuario_id: number;
  anio: any;
  mes: any;
  eventos?: IEvento[] | null;
=======
export interface Evento {
    id: number;
    calendario_id: number;
    fecha: string; // Usamos string para las fechas y horas, ya que vienen como strings del backend
    hora_inicio: string;
    hora_fin: string;
    estado: string;
  }
  

  export interface Calendario {
    id: number;
    usuario_id: number;
    anio: any;
    mes: any;
    eventos?: Evento[] | null;
>>>>>>> 90e25d6 (contratacion agregada bien)
}
