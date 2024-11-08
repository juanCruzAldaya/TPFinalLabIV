import { IProvince } from "./province.interface";

export interface IDepartment {
  id: string;
  nombre: string;
  provincia: IProvince;
  centroide: { lat: string; lon: string };
  categoria: string;
}

export interface IDepartments {
  departamentos: IDepartment[];
}
