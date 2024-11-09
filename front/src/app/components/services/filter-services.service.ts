import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IServicio } from "../../interfaces/servicio.interface";
import { environment } from "../../../enviroments/enviroments";

@Injectable({
  providedIn: "root",
})
export class FilterServicesService {
  private apiUrl = `${environment.LOCAL_API_URL}/servicios`; // Use HTTP for local development

  constructor(private http: HttpClient) {}

  getServices(): Observable<IServicio[]> {
    return this.http.get<IServicio[]>(this.apiUrl);
  }

  getCategoria(subCategoriaId: number): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/categorias/${subCategoriaId}`);
  }

  getSubCategoria(subCategoriaId: number): Observable<any> {
    return this.http.get(
      `http://127.0.0.1:8000/subcategorias/${subCategoriaId}`
    );
  }

  getProfesional(profesionalId: number): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/usuarios/${profesionalId}`);
  }
}
