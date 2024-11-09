export interface IEvento {
  id: number;
  calendario_id: number;
  fecha: string; // Usamos string para las fechas y horas, ya que vienen como strings del backend
  hora_inicio: string;
  hora_fin: string;
  estado: string;
}

export interface ICalendario {
  id: number;
  usuario_id: number;
  eventos: IEvento[];
}
