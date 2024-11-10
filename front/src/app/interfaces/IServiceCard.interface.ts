import { IService } from "../service.interface";

export interface IServiceCard {
    service: IService;
    category_name: string;
    subCategory_name: string;
    profesional_name: string;

    // Add any additional properties you need for the card component here
  }
  