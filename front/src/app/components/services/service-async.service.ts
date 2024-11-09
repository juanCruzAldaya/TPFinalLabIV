import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../enviroments/enviroments";
import { Service } from "../../models/service";

@Injectable({
  providedIn: "root",
})
export class ServicesService {
  private apiUrl = `${environment.LOCAL_API_URL}`; // Cambia al endpoint de FastAPI

  constructor(private http: HttpClient) {}

  getService(servicio_id: number): Promise<any> {
    return this.http.get(`${this.apiUrl}/servicios/${servicio_id}`).toPromise();
  }

  getServices(): Promise<any> {
    return this.http.get(`${this.apiUrl}/servicios`).toPromise();
  }

  addService(service: Service): Promise<any> {
    return this.http
      .post(`${this.apiUrl}/servicios`, service, {
        headers: { "Content-Type": "application/json" },
      })
      .toPromise();
  }
}
