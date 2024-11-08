export interface IProvince {
  id: string;
  centroide: { lat: string; lon: string };
  nombre: string;
}
export interface IProvinces {
  departamentos: IProvince[];
}
