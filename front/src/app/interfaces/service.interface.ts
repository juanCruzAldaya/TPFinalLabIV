export interface IService {
  id: string;
  description: string;
  mainCategory: number;
  secondaryCategory: number;
  state: string;
  department: string;
  locality: string;
  profesionalId: string;
}

export interface IServiceFilled extends IService {
  category_name: string;
  subCategory_name: string;
  profesional_name: string;
}
