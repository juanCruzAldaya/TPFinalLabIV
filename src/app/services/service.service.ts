// service.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"})
export class ServiceService {
  constructor() { }

  getServices() {
    return [
      { id: 1, title: 'Electricistas', description: 'Profesionales disponibles en tu zona.', image: "./plumber.jpg" },
      { id: 2, title: 'Fontaneros', description: 'Expertos en reparación e instalación.', image: "./plumber.jpg"},
      // Añade más servicios aquí con rutas de imágenes válidas
    ];
  }
}
