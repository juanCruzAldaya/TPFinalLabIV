import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebarProvider',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SidebarComponent {
  filterCriteria = {
    ciudad: '',
    nombre: ''
  };

  @Output() filterChanged = new EventEmitter<any>();

  onFilterChange() {
    this.filterChanged.emit(this.filterCriteria);
  }
}
