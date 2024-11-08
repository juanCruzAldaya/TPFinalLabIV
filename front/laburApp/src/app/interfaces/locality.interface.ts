export interface ILocality {
  id: string;
  centroide: { lat: string; lon: string };
  nombre: string;
}
export interface ILocalities {
  departamentos: ILocality[];
}
