// booking-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit{
  bookingForm: FormGroup;
  selectedSlot: string = '';
  selectedDate: string = '';
  userId: string | null = ''; // ID del usuario
  serviceId: string = ''; // ID del servicio
  calendarId: number  = 0
  

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private bookService: BookingService, private authService: AuthService) {
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
      this.serviceId = params['serviceId']
      this.bookingForm.patchValue({
        date: this.selectedDate,
        slot: this.selectedSlot
      });
    });
    this.userId = this.authService.getUserId();
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const bookingData = {
        ...this.bookingForm.value,
        date: this.selectedDate,
        slot: this.selectedSlot,
        service_id: this.serviceId,
        user_id: this.userId  // Aquí deberías obtener el ID del usuario logueado
      };

        
      console.log(bookingData)

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
  