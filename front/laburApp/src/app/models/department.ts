import { Province } from "./province";

export class Department {
  id: string = "";
  nombre: string = "";
  provincia: Province = {
    id: "",
    centroide: {
      lat: "",
      lon: "",
    },
    nombre: "",
  };
  centroide: { lat: string; lon: string } = { lat: "", lon: "" };
  categoria: string = "Departamento";
}
