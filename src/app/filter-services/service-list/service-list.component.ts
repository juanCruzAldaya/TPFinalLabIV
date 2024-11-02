import { Component, OnInit } from '@angular/core';
import { FilterServicesService } from '../../services/filter-services.service';
import { Servicio } from '../../interfaces/servicio.interface';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  services: Servicio[] = [];
  filteredServices: Servicio[] = [];
  filterCriteria = {
    localidad: '',
    nombre: '',
    calificacion: '',
    categoria: '',
    subCategoria: '',
    nombreProfesional: ''
  };

  constructor(private filterService: FilterServicesService) {}

  ngOnInit(): void {
    this.filterService.getServices().subscribe(
      (data: Servicio[]) => {
        this.services = data;
        this.filteredServices = data;
        this.loadAdditionalData();
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  loadAdditionalData(): void {
    this.services.forEach(service => {
      this.filterService.getCategoria(service.sub_categoria).subscribe(categoria => {
        service.categoria = categoria.nombre;
      });
      this.filterService.getSubCategoria(service.sub_categoria).subscribe(subCategoria => {
        service.subCategoria = subCategoria.nombre;
      });
      this.filterService.getProfesional(service.profesional_id).subscribe(profesional => {
        service.nombreProfesional = profesional.nombre;
      });
    });
  }

  updateFilter(criteria: any): void {
    this.filterCriteria = criteria;
    this.filterServices();
  }

  filterServices(): void {
    this.filteredServices = this.services.filter(service =>
      (this.filterCriteria.localidad ? service.localidad.includes(this.filterCriteria.localidad) : true) &&
      (this.filterCriteria.nombre ? service.nombre.includes(this.filterCriteria.nombre) : true) &&
      (this.filterCriteria.calificacion ? service.calificacion === +this.filterCriteria.calificacion : true) &&
      (this.filterCriteria.categoria ? service.categoria.includes(this.filterCriteria.categoria) : true) &&
      (this.filterCriteria.subCategoria ? service.subCategoria.includes(this.filterCriteria.subCategoria) : true) &&
      (this.filterCriteria.nombreProfesional ? service.nombreProfesional.includes(this.filterCriteria.nombreProfesional) : true)
    );
  }
}
