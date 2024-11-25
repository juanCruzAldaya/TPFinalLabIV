export interface IContract {
    id: number;
    fecha_contratacion: string;
    hora_contratacion: string; // Usamos string para las fechas y horas, ya que vienen como strings del backend
    contacto: string;
    domicilio: string;
    servicio_id: number,
    estado: string;
    comentarios: string;
    servicio_nombre: string;
    profesional_apellido: string;
    profesional_nombre: string;
    evento_id: number;
    cliente_id: number;
    cliente_nombre: string;
    cliente_apellido: string;

  }

 export interface IBackendContract {
    id: number;
    cliente_id: number;
    servicio_id: number;
    fecha_contratacion: string;
    hora_contratacion: string;
    calendario_id: number;
    evento_id: number;
    contacto: string;
    domicilio: string;
    estado: string;
    comentarios: string;
}