export interface IReseña {
  usuario_id: number;
  servicio_id: number;
  calificacion: number;
  comentario: string;
  fecha?: Date;
}
