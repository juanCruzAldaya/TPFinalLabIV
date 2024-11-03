// service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



export function getImagePath(title: string): string {
  console.log(title);
  return '../../assets/images/carousel/'+title+".jpg";
  
}


@Injectable({
  providedIn: 'root'

})


export class ServiceService {
  private apiUrl = 'http://127.0.0.1:8000/categorias'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      map(categories => categories.map(category => ({
        ...category,
        image: getImagePath(category.title)
      })))
    );
  }
}

export interface Category {
  id: number;
  title: string;
  image?: string;
}