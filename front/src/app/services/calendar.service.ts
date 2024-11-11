import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { map } from 'rxjs/operators';
import {Calendario} from '../interfaces/calendario.interface'
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) {}


  getCalendarByUserId(userId: number): Observable<number> {
    return this.http.get<any>(environment.LOCAL_API_URL + `/calendarByUsername/${userId}`)
      .pipe(
        map(response => response.calendario_id.calendar_id)
      );
  }

  getCalendar(userId: number): Observable<Calendario> {
    return this.http.get<Calendario>(environment.LOCAL_API_URL + `/calendarios/${userId}`);
  }
  createCalendar(calendario: Calendario): Observable<Calendario> {
    return this.http.post<Calendario>(environment.LOCAL_API_URL + `/calendarios`, calendario);
}

  createEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(environment.LOCAL_API_URL + `/eventos`, event);
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(environment.LOCAL_API_URL + `/eventos/${event.id}`, event);
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(environment.LOCAL_API_URL + `/eventos/${eventId}`);
  }





  getAvailableSlots(profesionalId: number, date: string): Observable<string[]> {
    return this.getCalendar(profesionalId).pipe(
      map(calendario => {
        const formattedDate = date;
        const events = calendario.eventos!.filter(event => event.fecha === formattedDate);
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


