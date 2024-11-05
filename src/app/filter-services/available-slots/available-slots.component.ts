import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrl: './available-slots.component.css'
})
export class AvailableSlotsComponent {
    @Input() availableSlots: string[] = [];
    @Output() slotSelected = new EventEmitter<string>();

    selectSlot(slot: string): void {
      this.slotSelected.emit(slot);
  }

}
