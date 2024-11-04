import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';

import {Calendario} from '../interfaces/calendario.interface'


@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) {}

  getCalendar(userId: number): Observable<Calendario> {
    return this.http.get<Calendario>(`${this.apiUrl}calendarios/${userId}`);
  }
 

  createEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.apiUrl}eventos`, event);
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${this.apiUrl}eventos/${event.id}`, event);
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}eventos/${eventId}`);
  }
}
