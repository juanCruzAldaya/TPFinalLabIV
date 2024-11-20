import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IReseña } from "../interfaces/resenia.interface";
import { environment } from "../../enviroments/enviroments";


@Injectable({
  providedIn: 'root'
})
export class ReseñasService {
  private Url = environment.LOCAL_API_URL + "/resenas";
  constructor(private http: HttpClient) {}

  // Enviar una nueva reseña
  submitReview(review: IReseña) {
    return this.http.post<IReseña>(`${this.Url}`, review);
  }
  /*
  export interface IReseña {
    usuario_id: number;
    servicio_id: number;
    calificacion: number;
    comentario: string;
    fecha?: Date;
  }*/

  // Obtener reseñas de un servicio
  getReviews(servicioId: number) {
    return this.http.get<IReseña[]>(`${this.Url}?servicio_id=${servicioId}`);
  }
}