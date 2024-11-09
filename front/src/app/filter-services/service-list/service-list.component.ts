import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FilterServicesService } from '../../services/filter-services.service';
import { Servicio } from '../../interfaces/servicio.interface';
import {CalendarComponent} from './../calendar/calendar.component';
import { CalendarService } from '../../services/calendar.service';
import { Calendario } from '../../interfaces/calendario.interface';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
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
  availableSlots: string[] = [];
  selectedDate: string | null = null;

  
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
        // Si el calendario existe, asignamos los eventos
        this.selectedService.eventos = calendario.eventos;
        this.showCalendar = true;
      },
      (error) => {
        console.error('Error al cargar el calendario', error);
        // Si hay un error (por ejemplo, el calendario no existe), inicializamos un calendario vacío
        this.selectedService.eventos = [];
        this.showCalendar = true;
      }
    );
  }

  handleDayClick(event: { day: CalendarMonthViewDay<any>, date: string }) {
    this.selectedDate = event.date;
    this.showCalendar = false;
    this.calendarService.getAvailableSlots(this.selectedService.profesional_id, this.selectedDate).subscribe(
      (availableSlots: string[]) => {
        this.availableSlots = availableSlots;
      },
      (error: any) => {
        console.error('Error fetching available slots', error);
      }
    );
  }
  

  hireService(service: any) {
    
    console.log('Contratando servicio:', service);
  }

 //More code...
  // Pagination logic...
  // Filter and sorting logic...
  // etc.



closeCalendarModal() {
  this.isCalendarModalOpen = false;
}


onDayClicked(date: string) {
  console.log('Día seleccionado:', date);
  // Aquí puedes llamar a un servicio para obtener los horarios disponibles para el día seleccionado
  this.calendarService.getAvailableSlots(this.selectedService.profesional_id, date).subscribe(
    (slots: any[]) => {
      this.availableSlots = slots;
      // Aquí puedes actualizar la vista para mostrar los horarios disponibles
    },
    (error) => {
      console.error('Error al obtener los horarios disponibles', error);
    }
  );
}

onSlotSelected(slot: string): void {
  console.log(slot);
  console.log('Selected slot:', slot);
  
  // Aquí puedes manejar la lógica para cuando se selecciona un horario
}
//

onEventClicked(event: Event) {
  // Lógica para manejar la selección de un evento en el calendario
  console.log('Evento seleccionado:', event);
}


onDateSelected(date: Date) {
  // Lógica para manejar la selección de una fecha en el calendario
  console.log('Fecha seleccionada:', date);
}


}

