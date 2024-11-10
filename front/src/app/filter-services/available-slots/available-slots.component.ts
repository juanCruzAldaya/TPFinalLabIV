import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-available-slots',
  template: `
    <div *ngIf="availableSlots.length > 0">
      <h3>Seleccione un horario disponible:</h3>
      <ul>
        <li *ngFor="let slot of availableSlots" (click)="selectSlot(slot)">
          {{ slot }}
        </li>
      </ul>
    </div>
    <div *ngIf="availableSlots.length === 0">
      <p>No hay horarios disponibles para la fecha seleccionada.</p>
    </div>
  `
})
export class AvailableSlotsComponent {
  @Input() availableSlots: string[] = [];
  @Input() serviceId: string = ''; // Add serviceId as an input
  @Output() slotSelected = new EventEmitter<{ slot: string, serviceId: string }>();
  @Output() idServicio: any = ''; // Add serviceId as an

  selectSlot(slot: string) {
    this.slotSelected.emit({ slot, serviceId: this.serviceId });
  }
}
