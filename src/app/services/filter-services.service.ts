import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../interfaces/servicio.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterServicesService {
  private apiUrl = 'http://127.0.0.1:8000/servicios'; // Use HTTP for local development

  constructor(private http: HttpClient) {}

  getServices(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  getCategoria(subCategoriaId: number): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/categorias/${subCategoriaId}`);
  }

  getSubCategoria(subCategoriaId: number): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/subcategorias/${subCategoriaId}`);
  }

  getProfesional(profesionalId: number): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/usuarios/${profesionalId}`);
  }
}
