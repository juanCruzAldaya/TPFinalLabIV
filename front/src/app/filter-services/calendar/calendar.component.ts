import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { CalendarService } from '../../services/calendar.service';
import { Evento } from '../../interfaces/calendario.interface';

@Component({
  selector: 'app-professional-calendar',
  template: `
    <div class="calendar-container">
      <ng-template #cellTemplate let-day="day">
        <div [ngClass]="{'disabled-day': isDisabled(day)}">
          {{ day.date | date: 'd' }}
        </div>
      </ng-template>
      <mwl-calendar-month-view
        [viewDate]="viewDate"
        [events]="calendarEvents"
        (dayClicked)="handleDayClick($event)"
        [cellTemplate]="cellTemplate">
      </mwl-calendar-month-view>
    </div>
  `,
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  viewDate: Date = new Date();
  @Input() events: Evento[] = [];
  @Output() dayClicked = new EventEmitter<{ day: CalendarMonthViewDay<any>, date: string }>();
  @Output() calendarLoaded = new EventEmitter<{ calendarId: number, serviceId: string }>(); // Emit calendarId and serviceId
  @ViewChild('cellTemplate') cellTemplate!: TemplateRef<any>;

  userId: any;
  calendarEvents: CalendarEvent[] = [];
  calendarId: number = 0;
  serviceId: string = ''; // Add serviceId as a property

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    ;
  }

  loadCalendar(user_id: number): void {
    this.calendarService.getCalendar(user_id).subscribe(data => {
      this.calendarId = data.id; // Assuming the calendar ID is part of the response
      this.serviceId = 'someServiceId'; // Replace with actual serviceId logic
      this.calendarLoaded.emit({ calendarId: this.calendarId, serviceId: this.serviceId }); // Emit the calendarId and serviceId
      this.calendarEvents = data.eventos!.map(event => ({
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

  handleDayClick(event: { day: CalendarMonthViewDay<any>; sourceEvent: MouseEvent | KeyboardEvent }): void {
    const today = new Date();
    const selectedDate = event.day.date;
    if (selectedDate > today) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      this.dayClicked.emit({ day: event.day, date: formattedDate });
    }
  }

  isDisabled(day: CalendarMonthViewDay): boolean {
    const today = new Date();
    return day.date < today || day.date.toDateString() === today.toDateString();
  }
}
