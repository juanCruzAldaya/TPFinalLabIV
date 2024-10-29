import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Province } from "../models/province";
import { Department } from "../models/department";

@Injectable({
  providedIn: "root",
})
export class LocationAsyncService {
  private apiUrl = "https://apis.datos.gob.ar/georef/api";
  constructor(private http: HttpClient) {}

  getAllProvinces(): Promise<any> {
    return this.http.get(`${this.apiUrl}/provincias`).toPromise();
  }

  getAllMunicipalitiesByProvince(province?: string | null): Promise<any> {
    return this.http
      .get(`${this.apiUrl}/departamentos?provincia=${province}&max=529`)
      .toPromise();
  }

  getAllLocalitiesByMunicipality(municipality: Department): Promise<any> {
    return this.http
      .get(`${this.apiUrl}/localidades?municipio=${municipality.nombre}`)
      .toPromise();
  }
}
