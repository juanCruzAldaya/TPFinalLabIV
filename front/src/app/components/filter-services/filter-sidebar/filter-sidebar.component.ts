import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.css']
})
export class FilterSidebarComponent {
  filterCriteria = {
    localidad: '',
    calificacion: 0,
    nombre: '',
    categoria: '',
    subCategoria: '',
    nombreProfesional: ''
  };

  @Output() filterChanged = new EventEmitter<any>();
  onRatingChange(rating: number) {
    if (this.filterCriteria.calificacion === rating) {
      this.filterCriteria.calificacion = 0; // Deselect if the same rating is clicked
    } else {
      this.filterCriteria.calificacion = rating; // Select the new rating
    }
    this.onFilterChange();
  }
  
  onFilterChange() {
    this.filterChanged.emit(this.filterCriteria);
  }
}
