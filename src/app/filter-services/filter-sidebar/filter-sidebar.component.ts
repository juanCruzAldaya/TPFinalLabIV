import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.css']
})
export class FilterSidebarComponent {
  filterCriteria = {
    localidad: '',
    nombre: '',
    calificacion: '',
    categoria: '',
    subCategoria: '',
    nombreProfesional: ''
  };

  @Output() filterChanged = new EventEmitter<any>();

  onFilterChange() {
    this.filterChanged.emit(this.filterCriteria);
  }
}
