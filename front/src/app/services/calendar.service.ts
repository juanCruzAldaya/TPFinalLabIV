import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError  } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { map } from 'rxjs/operators';
import {ICalendario, IEvento} from '../interfaces/calendario.interface'
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) {}


  getCalendarByUserId(userId: number): Observable<any> {
    return this.http.get<any>(environment.LOCAL_API_URL + `/calendarByUsername/${userId}`)
      .pipe(
        map(response => response)
      );
  }

  getCalendar(userId: number): Observable<ICalendario> {
    return this.http.get<ICalendario>(environment.LOCAL_API_URL + `/calendarios/${userId}`);
  }
  
  createCalendar(calendario: ICalendario): Observable<ICalendario> {
    return this.http.post<ICalendario>(environment.LOCAL_API_URL + '/calendarios', calendario).pipe(
      catchError(error => {
        console.error('Error creating calendario:', error);
        return throwError(error);
      })
    );
  }

  createEvent(evento: IEvento): Observable<IEvento> {
    return this.http.post<IEvento>(environment.LOCAL_API_URL + "/eventos", evento);
  }

  updateEvent(eventoId: number, evento: Partial<IEvento>): Observable<IEvento> {
    return this.http.put<IEvento>(`${environment.LOCAL_API_URL}/${eventoId}`, evento);
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(environment.LOCAL_API_URL + `/eventos/${eventId}`);
  }





  getAvailableSlots(profesionalId: number, date: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.LOCAL_API_URL}/availableSlots/${profesionalId}/${date}`);
  }
  
  private generatePossibleTimes(): string[] {
    const startHour = 9;
    const endHour = 17;
    const times: string[] = [];
  
    for (let hour = startHour; hour < endHour; hour++) {
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
    }
  
    return times;
  }


}


