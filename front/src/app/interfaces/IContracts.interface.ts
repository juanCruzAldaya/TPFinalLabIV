export interface IContract {
    id: number;
    fecha_contratacion: number;
    hora_contratacion: string; // Usamos string para las fechas y horas, ya que vienen como strings del backend
    contacto: string;
    domicilio: string;
    estado: string;
    comentarios: string;
    servicio_nombre: string;
    profesional_apellido: string;
    profesional_nombre: string;

  }