import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-available-slots',
  templateUrl: './available-slots.component.html',
  styleUrl: './available-slots.component.css'
})


export class AvailableSlotsComponent {
    @Input() availableSlots: string[] = [];
    @Input() unavailableSlots: string[] = [];
    @Output() slotSelected = new EventEmitter<string>();
    
    
    constructor(private router: Router,  private sharedService: SharedService) {}


 selectSlot(slot: string): void {

    this.sharedService.setSelectedSlot(slot);
    this.slotSelected.emit(slot);
    this.router.navigate(['/booking-form'], { queryParams: { slot} });
  }

  isSlotAvailable(slot: string): boolean {
    return !this.unavailableSlots.includes(slot);
  }
}


