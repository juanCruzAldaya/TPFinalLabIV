export interface IService {
  id: string;
  description: string;
  mainCategory: number;
  secondaryCategory: number;
  state: string;
  department: string;
  locality: string;
  profesionalId: string;
  calificacion?: number;
}
