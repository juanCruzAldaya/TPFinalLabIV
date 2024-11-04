import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FilterServicesService } from '../../services/filter-services.service';
import { Servicio } from '../../interfaces/servicio.interface';
import {CalendarComponent} from './../calendar/calendar.component';
import { CalendarService } from '../../services/calendar.service';
import { Calendario } from '../../interfaces/calendario.interface';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  
  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;
  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;

  isCalendarModalOpen = false;
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

  constructor(private filterService: FilterServicesService, private calendarService: CalendarService) {}

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

  
  openCalendarModal(service: any) {
    this.selectedService = service;
    this.isCalendarModalOpen = true;
    this.showCalendar = false;

    this.calendarService.getCalendar(service.profesional_id).subscribe(
      (calendario: Calendario) => {
        this.selectedService.eventos = calendario.eventos;
        this.showCalendar = true;
      },
      (error) => {
        console.error('Error al cargar el calendario', error);
      }
    );
  }
 
  hireService(service: any) {
    
    console.log('Contratando servicio:', service);
  }

  // More code...
  // Pagination logic...
  // Filter and sorting logic...
  // etc.



closeCalendarModal() {
  this.isCalendarModalOpen = false;
}

onDayClicked(date: Date) {
  // Lógica para manejar la selección de un día y mostrar los horarios disponibles
  console.log('Día seleccionado:', date);
}

onEventClicked(event: Event) {
  // Lógica para manejar la selección de un evento en el calendario
  console.log('Evento seleccionado:', event);
}

onSlotClicked(slot: any) {
  // Lógica para manejar la selección de un slot en el calendario
  console.log('Slot seleccionado:', slot);
}

onDateSelected(date: Date) {
  // Lógica para manejar la selección de una fecha en el calendario
  console.log('Fecha seleccionada:', date);
}

}