import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { map } from 'rxjs/operators';
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





  getAvailableSlots(profesionalId: number, date: Date): Observable<string[]> {
    return this.getCalendar(profesionalId).pipe(
      map(calendario => {
        const formattedDate = date.toISOString().split('T')[0];
        const events = calendario.eventos.filter(event => event.fecha === formattedDate);
        const blockedTimes = events.map(event => event.hora_inicio); // Asume que cada evento tiene una propiedad 'hora_inicio'
        const allPossibleTimes = this.generatePossibleTimes();
        return allPossibleTimes.filter(time => !blockedTimes.includes(time));
      })
    );
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


