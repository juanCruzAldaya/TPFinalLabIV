export interface IService {
  id: number;
  description: string;
  mainCategory: number;
  secondaryCategory: number;
  state: string;
  department: string;
  locality: string;
  profesionalId: number;
}

export interface IServiceFilled extends IService {
  mainCategoryName: string;
  secondaryCategoryName: string;
  profesionalName: string;
}
