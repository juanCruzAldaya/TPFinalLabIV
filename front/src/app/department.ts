import { IProvince } from "./province";

export interface IDepartment {
  id: string;
  nombre: string;
  provincia: IProvince;
  centroide: { lat: string; lon: string };
  categoria: string;
}
