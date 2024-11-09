import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IReseña } from "../interfaces/resenia.interface";
import { environment } from "../../enviroments/enviroments";

@Injectable({
  providedIn: "root",
})
export class ReseñasService {
  private apiUrl = `${environment.LOCAL_API_URL}/resenas`; // Cambia al endpoint de FastAPI

  constructor(private http: HttpClient) {}

  obtenerReseñas(servicio_id: number): Observable<IReseña[]> {
    return this.http.get<IReseña[]>(`${this.apiUrl}/${servicio_id}`);
  }

  agregarReseña(reseña: IReseña): Observable<IReseña> {
    return this.http.post<IReseña>(this.apiUrl, reseña);
  }
}
