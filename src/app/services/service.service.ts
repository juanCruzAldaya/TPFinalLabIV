// service.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"})
export class ServiceService {
  constructor() { }

  getServices() {
    return [
      { id: 1, title: 'Servicios del hogar', description: '', image: "assets\\images\\carousel\\electrician.jpg"},
      { id: 2, title: 'Servicios del hogar', description: '', image: "assets\\images\\carousel\\plumber.jpg"},
      { id: 3, title: 'Servicios del hogar', description: '', image: "assets\\images\\carousel\\tools.jpg"},
      { id: 4, title: 'Electrónica', description: '', image: "assets\\images\\carousel\\electronica.jpg"},
      { id: 5, title: 'Mecánica', description: '', image: "assets\\images\\carousel\\mecanica.jpg"},
      { id: 6, title: 'Joyería', description: '', image: "assets\\images\\carousel\\watch.jpg"},
      
      
      
      // Añade más servicios aquí con rutas de imágenes válidas
    ];
  }
}
