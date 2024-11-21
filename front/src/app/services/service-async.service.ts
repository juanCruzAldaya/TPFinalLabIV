import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../enviroments/enviroments";
import { IService } from "../interfaces/service.interface";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root",
})
export class ServicesService {
  private apiUrl = `${environment.LOCAL_API_URL}`; // Cambia al endpoint de FastAPI

  constructor(private http: HttpClient) {}

  getService(serviceId: number): Observable<IService> {
    return this.http.get<IService>(`${this.apiUrl}/servicio/${serviceId}`);
  }

  getServiceByUserId(
    serviceId: number,
    profesionalId: number
  ): Observable<IService> {
    return this.http.get<IService>(
      `${this.apiUrl}/servicio/${serviceId}/${profesionalId}`
    );
  }

  getServices(): Promise<any> {
    return this.http.get(`${this.apiUrl}/servicios`).toPromise();
  }

  addService(service: IService): Promise<any> {
    console.log("SERVICIO:", service);
    return this.http
      .post(`${this.apiUrl}/servicios`, service, {
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

  editService(
    id: string,
    profesionalId: string,
    service: IService
  ): Promise<any> {
    return this.http
      .put(
        `${environment.LOCAL_API_URL}/editar-servicio/${id}/${profesionalId}`,
        service
      )
      .toPromise();
  }
}
