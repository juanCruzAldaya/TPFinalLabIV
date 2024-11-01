import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocationAsyncService {
  private apiUrl = "https://apis.datos.gob.ar/georef/api";
  constructor(private http: HttpClient) {}

  getAllProvinces(): Promise<any> {
    return this.http.get(`${this.apiUrl}/provincias`).toPromise();
  }

  getAllDepartmentsByProvince(province?: string): Promise<any> {
    return this.http
      .get(`${this.apiUrl}/departamentos?provincia=${province}&max=529`)
      .toPromise();
  }

  getAllLocalitiesByDepartments(department: string): Promise<any> {
    return this.http
      .get(`${this.apiUrl}/localidades?departamento=${department}&max=500`)
      .toPromise();
  }
}
