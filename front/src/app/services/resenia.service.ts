import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IReseña } from "../interfaces/resenia.interface";
import { environment } from "../../enviroments/enviroments";

@Injectable({
  providedIn: "root",
})
export class ReseñasService {
  private apiUrl = environment.LOCAL_API_URL + "/resenas";

  constructor(private http: HttpClient) {}

  getReseñas(servicio_id: number): Observable<IReseña[]> {
    return this.http.get<IReseña[]>(`${this.apiUrl}/${servicio_id}`);
  }

  addReseña(data: any): Observable<IReseña> {
    return this.http.post<IReseña>(environment.LOCAL_API_URL+"/resena", data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
