import { Component, OnInit,Input  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.services';
import { CalendarService } from '../../services/calendar.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  
  bookingForm: FormGroup;
  selectedSlot: string = '';
  selectedDate: string = '';
  userId: number | null = 0; // ID del usuario
  serviceId: number = 0;
  calendarId: number = 0; // Receive calendarId as input

  constructor(private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private bookService: BookingService, 
    private authService: AuthService, 
    private calendarService: CalendarService, 
    private sharedService: SharedService) {
   
      this.bookingForm = this.fb.group({
        contact: ['', Validators.required],
        address: ['', Validators.required],
        comments: [''],
        date: [{ value: '', disabled: true }],
        slot: [{ value: '', disabled: true }]
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedSlot = params['slot'];
      this.selectedDate = params['date'];
      

      this.bookingForm.patchValue({
        date: this.selectedDate,
        slot: this.selectedSlot
      });
    });
    this.userId = this.authService.getUserId();
    if (this.userId !== null) {
      this.calendarService.getCalendarByUserId(this.userId).subscribe(
        calendar_Id => {
          this.calendarId = calendar_Id;
        
      });
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const bookingData = {
        id: 0,  // Include id field
        cliente_id: this.userId,
        servicio_id: this.sharedService.getServiceId(),
        fecha_contratacion: this.selectedDate,
        hora_contratacion: this.selectedSlot,
        calendario_id: this.calendarId,
        contacto: this.bookingForm.value.contact,
        domicilio: this.bookingForm.value.address,
        estado: 'pendiente',
        comentarios: this.bookingForm.value.comments
    };
      console.log(bookingData);

      this.bookService.addBooking(bookingData).subscribe(
        response => {
          console.log('Reserva enviada con éxito', response);
        },
        error => {
          console.error('Error al enviar la reserva', error);
        }
      );
    }
  }
}