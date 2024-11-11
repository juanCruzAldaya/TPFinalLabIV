import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IReseña } from "../interfaces/resenia.interface";

@Injectable({
  providedIn: "root",
})
export class ReseñasService {
  private apiUrl = "http://127.0.0.1:8000/resenas"; // Cambia al endpoint de FastAPI

  constructor(private http: HttpClient) {}

  obtenerReseñas(servicio_id: number): Observable<IReseña[]> {
    return this.http.get<IReseña[]>(`${this.apiUrl}/${servicio_id}`);
  }

  agregarReseña(reseña: IReseña): Observable<IReseña> {
    return this.http.post<IReseña>(this.apiUrl, reseña);
  }
}
