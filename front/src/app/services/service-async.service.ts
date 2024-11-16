import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../enviroments/enviroments";
import { IService } from "../interfaces/service.interface";

@Injectable({
  providedIn: "root",
})
export class ServicesService {
  private apiUrl = `${environment.LOCAL_API_URL}`; // Cambia al endpoint de FastAPI

  constructor(private http: HttpClient) {}

  getService(servicio_id: number): Promise<any> {
    return this.http
      .get(`${this.apiUrl}/editar-servicio/${servicio_id}`)
      .toPromise();
  }

  getServices(): Promise<any> {
    return this.http.get(`${this.apiUrl}/servicios`).toPromise();
  }

  addService(service: IService): Promise<any> {
    return this.http
      .post(`${this.apiUrl}/agregar-servicio`, service, {
        headers: { "Content-Type": "application/json" },
      })
      .toPromise();
  }

  getServicesByProfesionalId(profesionalId: number): Promise<any> {
    return this.http
      .get<IService[]>(
        `${environment.LOCAL_API_URL}/mis-servicios/${profesionalId}`
      )
      .toPromise();
  }

  deleteService(id: number): Promise<any> {
    return this.http
      .delete(`${environment.LOCAL_API_URL}/eliminar-servicio/${id}`)
      .toPromise();
  }
}
