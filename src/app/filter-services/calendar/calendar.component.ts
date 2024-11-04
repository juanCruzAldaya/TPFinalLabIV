import { Component, OnInit } from '@angular/core';
import { CalendarEvent} from 'angular-calendar';
import { CalendarService } from '../../services/calendar.service';

import { HttpClient } from '@angular/common/http';

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
    this.calendarService.getCalendar(user_id).subscribe(data => {
      this.events = data.eventos.map(event => ({
        
        start: new Date(event.fecha + 'T' + event.hora_inicio),
        end: new Date(event.fecha + 'T' + event.hora_fin),
        title: event.estado,
      }));
      
    });
  }

  onEventClick(event: { event: CalendarEvent }): void {
    console.log('Event clicked:', event);
  }
}
