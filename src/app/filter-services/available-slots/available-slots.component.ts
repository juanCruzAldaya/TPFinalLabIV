import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrl: './available-slots.component.css'
})
export class AvailableSlotsComponent {
    @Input() availableSlots: string[] = [];
    @Output() slotSelected = new EventEmitter<string>();


    constructor(private router: Router) {}


 selectSlot(slot: string): void {
    const selectedDate = new Date().toISOString().split('T')[0]; // Aquí deberías obtener la fecha seleccionada
    this.slotSelected.emit(slot);
    this.router.navigate(['/booking-form'], { queryParams: { slot, date: selectedDate } });
  }

}
