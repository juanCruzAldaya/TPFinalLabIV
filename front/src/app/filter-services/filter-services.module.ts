import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule if needed
import { SharedModule } from '../shared/shared.module';
import { FilterSidebarComponent } from './filter-sidebar/filter-sidebar.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { CalendarComponent } from '../filter-services/calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarService } from '../services/calendar.service';
import { AvailableSlotsComponent } from './available-slots/available-slots.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FilterSidebarComponent,
    ServiceListComponent,
    CalendarComponent,
    AvailableSlotsComponent,
    BookingFormComponent,
   
    
  ],
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule here
    SharedModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    
      
      
    }),
    
  ],
  exports: [
    FilterSidebarComponent,
    ServiceListComponent,
    CalendarComponent,
    AvailableSlotsComponent,
    BookingFormComponent,
    
    
  ],
  providers: [
    CalendarService,
    BookingFormComponent,
    
     // Add CalendarComponent to providers if needed
  ]
})
export class FilterServiceModule { }
