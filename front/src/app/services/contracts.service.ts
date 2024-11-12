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
  ) {}


  get_contrataciones_clientes(id_user: any): Observable<any> {
    const url = `${environment.LOCAL_API_URL}/contrataciones_clientes/${id_user}`;
    console.log('Fetching contracts from URL:', url);  // Debugging line
    return this.http.get<any>(url);
  }

}  


