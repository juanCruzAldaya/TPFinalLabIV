import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IService } from "../../app/interfaces/service.interface";
import { environment } from "../../enviroments/enviroments";
@Injectable({
  providedIn: "root",
})
export class FilterServicesService {
  constructor(private http: HttpClient) {}

  getServices(): Observable<IService[]> {
    return this.http.get<IService[]>(`${environment.LOCAL_API_URL}/servicios`);
  }

  getCategoria(categoriaId: number): Observable<any> {
    return this.http.get(
      `${environment.LOCAL_API_URL}/categoria/${categoriaId}`
    );
  }

  getSubCategoria(subCategoriaId: number): Observable<any> {
    return this.http.get(
      `${environment.LOCAL_API_URL}/subcategoria/${subCategoriaId}`
    );
  }

  getProfesional(profesionalId: any): Observable<any> {
    return this.http.get(
      `${environment.LOCAL_API_URL}/usuarios/${profesionalId}`
    );
  }

  getServicesByProfesionalId(profesionalId: number): Observable<any> {
    return this.http.get(
      `${environment.LOCAL_API_URL}/misServicios/${profesionalId}`
    );
  }
}
