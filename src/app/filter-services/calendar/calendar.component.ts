import { Component, OnInit } from '@angular/core';
import { CalendarEvent} from 'angular-calendar';
import { CalendarService } from '../../services/calendar.service';
import {Calendario } from '../../interfaces/calendario.interface'

@Component({
  selector: 'app-professional-calendar',
  template: `
    <div class="calendar-container">
      <mwl-calendar-month-view
        [viewDate]="viewDate"
        [events]="events">
      </mwl-calendar-month-view>
    </div>
  `,
  styles: [`
    .calendar-container {
      width: 100%;
      height: 100%;
    }
  `]
})


export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    
  }

  loadCalendar(user_id: number): void {
     // Reemplaza con el ID del usuario actual
    console.log(user_id)
    this.calendarService.getCalendar(user_id).subscribe(data => {
      console.log(data)
      this.events = data.eventos.map(event => ({
        
        start: new Date(event.fecha + 'T' + event.hora_inicio),
        end: new Date(event.fecha + 'T' + event.hora_fin),
        title: event.estado,
      }));
      console.log(event)
    });
  }

  onEventClick(event: { event: CalendarEvent }): void {
    console.log('Event clicked:', event);
  }
}
