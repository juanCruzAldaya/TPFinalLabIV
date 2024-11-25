import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const IMAGE_MAP: { [key: string]: { id: number, image: string } } = {
  'Reparación y mantenimiento': { id: 1, image: 'reparacion.jpg' },
  'Servicios de limpieza': { id: 2, image: 'limpieza.jpg' },
  'Servicios de jardinería y paisajismo': { id: 3, image: 'jardineria.jpg' },
  'Cuidado personal': { id: 4, image: 'cuidado_personal.jpg' },
  'Servicios de belleza': { id: 5, image: 'belleza.jpg' },
  'Transporte y mudanza': { id: 6, image: 'mudanza.jpg' },
  'Educación y formación': { id: 7, image: 'educacion.jpg' },
  'Servicios para eventos': { id: 8, image: 'eventos.jpg' },
  'Consultoría y asesoría': { id: 9, image: 'consultoria.jpg' },
  'Servicios digitales': { id: 10, image: 'digitales.jpg' },
  'Servicios para mascotas': { id: 11, image: 'mascotas.jpg' }
};

export function getImagePath(title: string): string {
  if (!title) {
    return '../../assets/images/carousel/default.jpg'; // Imagen por defecto si el título no está definido
  }
  return `../../assets/images/carousel/${IMAGE_MAP[title]?.image || 'default.jpg'}`;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor() { }

  getCategories(): Observable<Category[]> {
    const categories: Category[] = Object.keys(IMAGE_MAP).map(title => ({
      id: IMAGE_MAP[title].id,
      title,
      image: getImagePath(title)
    }));
    return of(categories);
  }
}


export interface Category {
  id: number;
  title: string;
  image?: string;
}
