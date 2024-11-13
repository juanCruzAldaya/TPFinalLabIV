import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.services";
import { environment } from "../../enviroments/enviroments";
import { IContract } from "../interfaces/IContracts.interface";




@Injectable({
  providedIn: "root",
})
export class ContractsService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}


  get_contrataciones_clientes(): Observable<any> {
    const url = `${environment.LOCAL_API_URL}/contrataciones_clientes/${this.authService.getUserId()}`;
    return this.http.get<any>(url);
  }
  get_contrataciones_professionals(): Observable<any> {
    const url = `${environment.LOCAL_API_URL}/contrataciones_profesionales/${this.authService.getUserId()}`;
    return this.http.get<any>(url);
  }


}  


