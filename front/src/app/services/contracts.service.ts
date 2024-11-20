import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { environment } from "../../enviroments/enviroments";
import { IContract, IBackendContract } from "../interfaces/IContracts.interface";




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

  get_contrataciones_service_id(id:any): Observable<any> {
    const url = `${environment.LOCAL_API_URL}/contrataciones_service_id/${id}`;
    return this.http.get<any>(url);
  }

  get_contrataciones_profesionales(): Observable<any> {
    const url = `${environment.LOCAL_API_URL}/contrataciones_profesionales/${this.authService.getUserId()}`;
    return this.http.get<any>(url);
  }
  updateContractStatus(contractId: number, status: string): Observable<any> {
    return this.http.put(`${environment.LOCAL_API_URL}/contracts_status/${contractId}`, { estado: status });
  }
  updateContract(contract: IBackendContract): Observable<any> {
    return this.http.put(`${environment.LOCAL_API_URL}/update_contracts/${contract.id}`, contract);
  }
  updateContractEventId(contractId: number, eventoId: number): Observable<any> {
    return this.http.put(`${environment.LOCAL_API_URL}/update_contract_event_id/${contractId}`, { evento_id: eventoId });

} 


deleteEventId(eventoId: number): Observable<any> {
  return this.http.delete(`${environment.LOCAL_API_URL}/delete_event/${eventoId}`);
}

}

