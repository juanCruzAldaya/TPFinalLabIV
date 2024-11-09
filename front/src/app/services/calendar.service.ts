import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CalendarEvent } from "angular-calendar";
import { map } from "rxjs/operators";
import { ICalendario } from "../interfaces/calendario.interface";
import { environment } from "../../enviroments/enviroments";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  private apiUrl = `${environment.LOCAL_API_URL}`;

  constructor(private http: HttpClient) {}

  getCalendar(userId: number): Observable<ICalendario> {
    return this.http.get<ICalendario>(`${this.apiUrl}/calendarios/${userId}`);
  }

  createEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${this.apiUrl}/eventos`, event);
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(
      `${this.apiUrl}/eventos/${event.id}`,
      event
    );
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eventos/${eventId}`);
  }

  getAvailableSlots(profesionalId: number, date: string): Observable<string[]> {
    return this.getCalendar(profesionalId).pipe(
      map((calendario) => {
        const formattedDate = date;
        const events = calendario.eventos.filter(
          (event) => event.fecha === formattedDate
        );
        const blockedTimes = events.map((event) => event.hora_inicio); // Asume que cada evento tiene una propiedad 'hora_inicio'
        const allPossibleTimes = this.generatePossibleTimes();
        return allPossibleTimes.filter((time) => !blockedTimes.includes(time));
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
