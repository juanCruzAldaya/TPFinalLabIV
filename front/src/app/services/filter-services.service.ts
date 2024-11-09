import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IServicio } from "../interfaces/servicio.interface";
import { environment } from "../../enviroments/enviroments";

@Injectable({
  providedIn: "root",
})
export class FilterServicesService {
  private apiUrl = `${environment.LOCAL_API_URL}`; // Use HTTP for local development

  constructor(private http: HttpClient) {}

  getServices(): Observable<IServicio[]> {
    return this.http.get<IServicio[]>(`${this.apiUrl}/servicios`);
  }

  getCategoria(subCategoriaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorias/${subCategoriaId}`);
  }

  getSubCategoria(subCategoriaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/subcategorias/${subCategoriaId}`);
  }

  getProfesional(profesionalId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${profesionalId}`);
  }
}
