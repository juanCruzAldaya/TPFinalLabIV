import { Injectable } from '@angular/core';
import { Observable, firstValueFrom  } from 'rxjs';
import {IService} from '../interfaces/service.interface'
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroments';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private serviceId: number = 0;
  constructor (
    
    private http: HttpClient,
  ){
    
  }


  setServiceId(id: number): void {
    this.serviceId = id;
  }

  getServiceId(): number {
    return this.serviceId;
  }




  getProfesionalByServiceId(id: number): Promise<any> {
    return this.http.get<any>(environment.LOCAL_API_URL + '/get_profesional_id_by_service/' + id).toPromise();
  }

}