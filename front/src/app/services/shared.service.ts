import { Injectable } from '@angular/core';
import { Observable, firstValueFrom  } from 'rxjs';
import {IService} from '../interfaces/service.interface'
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroments';
import { ToastrService } from "ngx-toastr";
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private serviceId: number = 0;
  private selectedDate: string = '';
  private selectedSlot: string = '';
  private calendarId: number = 0;
  constructor (
    
    private http: HttpClient,
    private toastr: ToastrService,
  ){
    
  }


  showSuccess(msg: string) {
    this.toastr.success(msg);
  }
  showError() {
    this.toastr.error("Algo salio mal");
  }

  setCalendarId(id: number): void {
    this.calendarId = id;
  }
  getCalendarId(): number {
    return this.calendarId;
  }
  setSelectedDate(date: string): void {
    this.selectedDate = date;
  }

  getSelectedDate(): string {
    return this.selectedDate;
  }

  setSelectedSlot(slot: string): void {
    this.selectedSlot = slot;
  }

  getSelectedSlot(): string {
    return this.selectedSlot;
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