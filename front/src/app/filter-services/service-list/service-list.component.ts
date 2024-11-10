import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FilterServicesService } from '../../services/filter-services.service';
import { CalendarService } from '../../services/calendar.service';
import { IService } from '../../service.interface';
import { IServiceCard } from '../../interfaces/IServiceCard.interface';
import { CalendarComponent } from './../calendar/calendar.component';
import { CalendarMonthViewDay } from 'angular-calendar';
import { Calendario } from '../../interfaces/calendario.interface';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;
  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;

  isCalendarModalOpen = false;
  services: IService[] = [];
  serviceCards: IServiceCard[] = [];
  serviceCard: IServiceCard | undefined;
  showCalendar: boolean = false;
  filteredServices: IServiceCard[] = [];
  pageSize = 10;
  currentPage = 1;
  availableSlots: string[] = [];
  selectedDate: string | null = null;
  selectedService: any;
  selectedServiceId: string = '';
  isModalOpen = false;
  filterCriteria = {
    localidad: '',
    nombre: '',
    calificacion: '',
    categoria: '',
    subCategoria: '',
    nombreProfesional: ''
  };

  constructor(private filterService: FilterServicesService, private calendarService: CalendarService, private authService: AuthService, private router: Router) {}

  showServiceDetails(service: IServiceCard) {
    this.selectedService = service;
    this.selectedServiceId = service.service.id; // Assign the real serviceId
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnInit(): void {
    this.filterService.getServices().subscribe(
      (data: IService[]) => {
        this.services = data;
        this.loadAdditionalData();
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  loadAdditionalData(): void {
    this.services.forEach(service => {
      this.filterService.getCategoria(service.mainCategory).subscribe(categoria => {
        const serviceCard: IServiceCard = {
          service,
          category_name: categoria.nombre,
          subCategory_name: '',
          profesional_name: ''
        };
        this.filterService.getSubCategoria(service.secondaryCategory).subscribe(subCategoria => {
          serviceCard.subCategory_name = subCategoria.nombre;
          this.filterService.getProfesional(service.profesionalId).subscribe(profesional => {
            serviceCard.profesional_name = profesional.nombre + " " + profesional.apellido;
            this.serviceCards.push(serviceCard);
            if (this.serviceCards.length === this.services.length) {
              this.loadServices();
              this.setupIntersectionObserver();
            }
          });
        });
      });
    });
  }

  updateFilter(criteria: any): void {
    this.filterCriteria = criteria;
    this.currentPage = 1;
    this.filteredServices = [];
    this.loadServices();
  }

  loadServices(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    const newServices = this.serviceCards.slice(start, end).filter(serviceCard =>
      (this.filterCriteria.localidad ? serviceCard.service.locality.includes(this.filterCriteria.localidad) : true) &&
      (this.filterCriteria.nombre ? serviceCard.service.description.includes(this.filterCriteria.nombre) : true) &&
      (this.filterCriteria.categoria ? serviceCard.category_name.includes(this.filterCriteria.categoria) : true) &&
      (this.filterCriteria.subCategoria ? serviceCard.subCategory_name.includes(this.filterCriteria.subCategoria) : true) &&
      (this.filterCriteria.nombreProfesional ? serviceCard.profesional_name.includes(this.filterCriteria.nombreProfesional) : true)
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
    } else {
      console.log('CalendarComponent not loaded');
    }
  }

  openCalendarModal(service: any) {
    this.selectedService = service;
    this.isCalendarModalOpen = true;
    this.showCalendar = false;
  
    this.calendarService.getCalendar(this.authService.getUserId()).subscribe(
      (calendario: Calendario) => {
        this.selectedService.eventos = calendario.eventos;
        this.showCalendar = true;
      },
      (error) => {
        console.error('Error al cargar el calendario', error);
        this.selectedService.eventos = [];
        this.showCalendar = true;
      }
    );
  }

  handleDayClick(event: { day: CalendarMonthViewDay<any>, date: string }) {
    this.selectedDate = event.date;
    this.showCalendar = false;
    this.calendarService.getAvailableSlots(this.authService.getUserId(), this.selectedDate).subscribe(
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

  closeCalendarModal() {
    this.isCalendarModalOpen = false;
  }

  onDayClicked(date: string) {
    console.log('Día seleccionado:', date);
    this.calendarService.getAvailableSlots(this.selectedService.profesional_id, date).subscribe(
      (slots: any[]) => {
        this.availableSlots = slots;
      },
      (error) => {
        console.error('Error al obtener los horarios disponibles', error);
      }
    );
  }

  onSlotSelected(event: { slot: string, serviceId: string }) {
    const { slot, serviceId } = event;
    this.router.navigate(['/booking-form'], {
      queryParams: { slot, serviceId, date: this.selectedDate } // Use the selected date
    });
  }


onEventClicked(event: Event) {
  // Lógica para manejar la selección de un evento en el calendario
  console.log('Evento seleccionado:', event);
}


onDateSelected(date: Date) {
  // Lógica para manejar la selección de una fecha en el calendario
  console.log('Fecha seleccionada:', date);
}


}

