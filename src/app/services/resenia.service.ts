import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reseña } from '../interfaces/resenia';


@Injectable({
  providedIn: 'root'
})
export class ReseñasService {
  private apiUrl = 'http://127.0.0.1:8000/resenas';  // Cambia al endpoint de FastAPI

  constructor(private http: HttpClient) {}

  obtenerReseñas(servicio_id: number): Observable<Reseña[]> {
    return this.http.get<Reseña[]>(`${this.apiUrl}/${servicio_id}`);
  }

  agregarReseña(reseña: Reseña): Observable<Reseña> {
    return this.http.post<Reseña>(this.apiUrl, reseña);
  }


}



