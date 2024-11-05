import { Component, OnInit, Input,Output, EventEmitter} from '@angular/core';
import { CalendarEvent, CalendarView, CalendarMonthViewDay } from 'angular-calendar';
import { CalendarService } from '../../services/calendar.service';
import { Evento } from '../../interfaces/calendario.interface';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-professional-calendar',
  template: `
    <div class="calendar-container">
      <mwl-calendar-month-view
        [viewDate]="viewDate"
        [events]="calendarEvents"
        (dayClicked)="handleDayClick($event)">
      </mwl-calendar-month-view>
    </div>
  `,
   styles: [`
    .calendar-container {
      width: 100%;
      height: 400px;
    }
  `]
})


export class CalendarComponent implements OnInit {

  viewDate: Date = new Date();
  @Input () events: Evento[] = [];
  @Output() dayClicked = new EventEmitter<{ day: CalendarMonthViewDay<any> }>();

  calendarEvents: CalendarEvent[] = [];

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
  }

  loadCalendar(user_id: number): void {
    this.calendarService.getCalendar(user_id).subscribe(data => {
      this.calendarEvents = data.eventos.map(event => ({
        
        start: new Date(event.fecha + 'T' + event.hora_inicio),
        end: new Date(event.fecha + 'T' + event.hora_fin),
        title: event.estado,
        color: {
          primary: event.estado === 'reservado' ? '#ad2121' : '#1e90ff',
          secondary: event.estado === 'reservado' ? '#FAE3E3' : '#D1E8FF'
        }
      }));
      
    });
  }

  onEventClick(event: { event: CalendarEvent }): void {
    console.log('Event clicked:', event);
  }
  handleDayClick(event: { day: CalendarMonthViewDay<any>; sourceEvent: MouseEvent | KeyboardEvent }): void {
    this.dayClicked.emit({ day: event.day });
  }
}
