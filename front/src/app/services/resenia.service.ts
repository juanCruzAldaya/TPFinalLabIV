import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IReseña } from "../interfaces/resenia.interface";
import { environment } from "../../enviroments/enviroments";

@Injectable({
  providedIn: "root",
})
export class ReseñasService {
  constructor(private http: HttpClient) {}

  obtenerReseñas(servicio_id: number): Observable<IReseña[]> {
    return this.http.get<IReseña[]>(
      `${environment.LOCAL_API_URL}/resenas/${servicio_id}`
    );
  }

  agregarReseña(reseña: IReseña): Observable<IReseña> {
    return this.http.post<IReseña>(
      `${environment.LOCAL_API_URL}/resenas`,
      reseña
    );
  }
}
