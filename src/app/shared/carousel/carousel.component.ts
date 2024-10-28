// carousel.component.ts
// carousel.component.ts
import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  services: any[] = [];

  constructor(private serviceService: ServiceService) { }

  ngOnInit(): void {
    this.services = this.serviceService.getServices();
    console.log(this.services); // Verifica el contenido de services
  }
}
