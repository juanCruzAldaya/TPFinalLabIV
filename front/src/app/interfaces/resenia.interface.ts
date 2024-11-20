export interface IReseña {
  id: number;
  cliente_id: number;
  servicio_id: number;
  calificacion: number;
  comentario: string;
  fecha?: string;
}
