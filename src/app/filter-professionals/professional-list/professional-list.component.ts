import { Component, OnInit } from '@angular/core';
import { ProfessionalService } from '../../services/professional.service';
import { Professional } from '../../interfaces/professional';

@Component({
  selector: 'app-professional-list',
  templateUrl: './professional-list.component.html',
  styleUrls: ['./professional-list.component.css']
})
export class ProfessionalListComponent implements OnInit {
  professionals: Professional[] = [];
  filteredProfessionals: Professional[] = [];
  filterCriteria = {
    ciudad: '',
    nombre: ''
  };

  constructor(private professionalService: ProfessionalService) {}

  ngOnInit(): void {
    this.professionalService.getProfessionals().subscribe((data: Professional[]) => {
      this.professionals = data;
      this.filteredProfessionals = data;
    });
  }

  updateFilter(criteria: any): void {
    this.filterCriteria = criteria;
    this.filterProfessionals();
  }

  filterProfessionals(): void {
    this.filteredProfessionals = this.professionals.filter(professional =>
      (this.filterCriteria.ciudad ? professional.ciudad.includes(this.filterCriteria.ciudad) : true) &&
      (this.filterCriteria.nombre ? (professional.nombre.includes(this.filterCriteria.nombre)) : true)
    );
  }
}
