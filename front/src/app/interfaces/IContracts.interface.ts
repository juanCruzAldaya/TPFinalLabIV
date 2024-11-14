export interface IContract {
    id: number;
    fecha_contratacion: string;
    hora_contratacion: string; // Usamos string para las fechas y horas, ya que vienen como strings del backend
    contacto: string;
    domicilio: string;
    estado: string;
    comentarios: string;
    servicio_nombre: string;
    profesional_apellido: string;
    profesional_nombre: string;

  }

 export interface IBackendContract {
    id: number;
    cliente_id: number;
    servicio_id: number;
    fecha_contratacion: string;
    hora_contratacion: string;
    calendario_id: number;
    contacto: string;
    domicilio: string;
    estado: string;
    comentarios: string;
}




/*class Contratacion(BaseModel):
    id: Optional[int]
    cliente_id: Optional[int]
    servicio_id: Optional[int]
    fecha_contratacion: Optional[str]  # Should be a string
    hora_contratacion: Optional[str]  # Should be a string
    calendario_id: Optional[int]
    contacto: Optional[str]  # Should be a string
    domicilio: Optional[str]  # Should be a string
    estado: Optional[str]  # Should be a string
    comentarios: Optional[str]*/