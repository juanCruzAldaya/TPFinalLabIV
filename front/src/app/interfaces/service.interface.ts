export interface IService {
  id: number;
  descripcion: string;
  categoria: number;
  sub_categoria: number;
  provincia: string;
  departamento: string;
  localidad: string;
  profesional_id: number;
}

export interface IServiceFilled extends IService {
  nombre_categoria: string;
  nombre_subcategoria: string;
  nombre_profesional: string;
}
