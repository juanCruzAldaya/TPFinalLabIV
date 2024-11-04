import { Component, OnInit } from '@angular/core';
import { ProfessionalService } from '../../services/professional.service';
import { Professional } from '../../interfaces/Users.interfaces';


@Component({
  selector: 'app-professional-list',
  templateUrl: './professional-list.component.html',
  styleUrls: ['./professional-list.component.css']
})
export class ProfessionalListComponent implements OnInit {
  professionals: Professional[] = [];
  filteredProfessionals: Professional[] = [];
  filterCriteria = {
    zona: '',
    ciudad: ''
  };

  constructor(private professionalService: ProfessionalService) {}

  ngOnInit(): void {
    
    this.professionalService.getProfessionals().subscribe((data: Professional[]) => {
      this.professionals = data;
      this.filteredProfessionals = data;
    });
  }

  filterProfessionals(): void {
    this.filteredProfessionals = this.professionals.filter(professional =>
      (this.filterCriteria.zona ? professional.zona.includes(this.filterCriteria.zona) : true) &&
      (this.filterCriteria.ciudad ? professional.ciudad.includes(this.filterCriteria.ciudad) : true)
    );
  }
}
