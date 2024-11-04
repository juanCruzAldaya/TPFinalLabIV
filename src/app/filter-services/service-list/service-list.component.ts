import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FilterServicesService } from '../../services/filter-services.service';
import { Servicio } from '../../interfaces/servicio.interface';
import {CalendarComponent} from './../calendar/calendar.component';


@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  
  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;
  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;

  services: Servicio[] = []; // Array of Servicio
  showCalendar: boolean = false;
  filteredServices: Servicio[] = []; // Array of Servicio filtered 
  pageSize = 10; // Number of pages to  
  currentPage = 1; // Current page number

  
  filterCriteria = {
    localidad: '',
    nombre: '',
    calificacion: '',
    categoria: '',
    subCategoria: '',
    nombreProfesional: ''
  };

  constructor(private filterService: FilterServicesService) {}

  selectedService: any;
  isModalOpen = false;

  showServiceDetails(service: any) {
    this.selectedService = service;
    this.isModalOpen = true;
    if (this.isModalOpen == true){
      
    }

  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnInit(): void {
    this.filterService.getServices().subscribe(
      (data: Servicio[]) => {
        this.services = data;
        this.filteredServices = [];
        this.loadServices();
        this.loadAdditionalData();
        this.setupIntersectionObserver();
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
        service.nombreProfesional = profesional.nombre + " " + profesional.apellido;
      });
    });
  }

  updateFilter(criteria: any): void {
    this.filterCriteria = criteria;
    this.currentPage = 1;
    this.filteredServices = [];
    this.loadServices();
  }

  // filterServices(): void {
  //   this.filteredServices = this.services.filter(service =>
  //     (this.filterCriteria.localidad ? service.localidad.includes(this.filterCriteria.localidad) : true) &&
  //     (this.filterCriteria.nombre ? service.nombre.includes(this.filterCriteria.nombre) : true) &&
  //     (this.filterCriteria.calificacion ? service.calificacion === +this.filterCriteria.calificacion : true) &&
  //     (this.filterCriteria.categoria ? service.categoria.includes(this.filterCriteria.categoria) : true) &&
  //     (this.filterCriteria.subCategoria ? service.subCategoria.includes(this.filterCriteria.subCategoria) : true) &&
  //     (this.filterCriteria.nombreProfesional ? service.nombreProfesional.includes(this.filterCriteria.nombreProfesional) : true)
  //   );
  // }

  loadServices(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    const newServices = this.services.slice(start, end).filter(service =>
      (this.filterCriteria.localidad ? service.localidad.includes(this.filterCriteria.localidad) : true) &&
      (this.filterCriteria.nombre ? service.nombre.includes(this.filterCriteria.nombre) : true) &&
      (this.filterCriteria.calificacion ? service.calificacion === +this.filterCriteria.calificacion : true) &&
      (this.filterCriteria.categoria ? service.categoria.includes(this.filterCriteria.categoria) : true) &&
      (this.filterCriteria.subCategoria ? service.subCategoria.includes(this.filterCriteria.subCategoria) : true) &&
      (this.filterCriteria.nombreProfesional ? service.nombreProfesional.includes(this.filterCriteria.nombreProfesional) : true)
    );
    this.filteredServices = [...this.filteredServices, ...newServices];
    this.currentPage++;
  }

  setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.loadServices();
      }
    });
    observer.observe(this.scrollAnchor.nativeElement);
  }

  ngAfterViewInit(): void {
    if (this.calendarComponent){
      console.log('CalendarComponent loaded');

    }
    else{
      console.log('CalendarComponent not loaded');
    }
  }

  
  checkAvailability(service: any) {
    this.selectedService = service;
    
    console.log(this.calendarComponent)
    
    if (this.calendarComponent){
      console.log('CalendarComponent loaded');
      this.showCalendar = true;

      this.calendarComponent.loadCalendar(service.profesional_id);
    }
    else{
      console.log('CalendarComponent not loaded');
    }
   

  }

  hireService(service: any) {
    
    console.log('Contratando servicio:', service);
  }

  // More code...
  // Pagination logic...
  // Filter and sorting logic...
  // etc.
}
