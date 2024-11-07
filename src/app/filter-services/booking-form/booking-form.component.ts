// booking-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit{
  bookingForm: FormGroup;
  selectedSlot: string = '';
  selectedDate: string = '';
  

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
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
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      console.log('Formulario enviado', this.bookingForm.value, 'Slot seleccionado:', this.selectedSlot, 'Fecha seleccionada:', this.selectedDate);
      // Aquí puedes agregar la lógica para enviar la solicitud de reserva
    }
  }
}
  