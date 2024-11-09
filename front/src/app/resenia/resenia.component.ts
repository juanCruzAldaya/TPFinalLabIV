import { Component, OnInit } from '@angular/core';
import { ReseñasService } from '../services/resenia.service'
import { Reseña } from '../interfaces/resenia.interface';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-resenia',
  templateUrl: './resenia.component.html',
  styleUrls: ['./resenia.component.css']
})
export class ReseñasComponent implements OnInit {
  resenias: Reseña[] = [];
  nuevaResenia: Reseña = { usuario_id: 0, servicio_id: 0, calificacion: 5, comentario: '' };

  constructor(private reseñasService: ReseñasService) {}

  ngOnInit(): void {
    // Suponiendo que tienes el servicio_id, puedes reemplazarlo aquí
    const servicio_id = 1;  // ID del servicio específico
    this.obtenerResenias(servicio_id);
  }

  obtenerResenias(servicio_id: number): void {
    this.reseñasService.obtenerReseñas(servicio_id).subscribe((data) => {
      this.resenias = data;
    });
  }

  agregarResenia(): void {
    this.reseñasService.agregarReseña(this.nuevaResenia).subscribe((data) => {
      this.resenias.push(data);
      this.nuevaResenia = { usuario_id: 0, servicio_id: 0, calificacion: 5, comentario: '' };  
    });
  }
  seleccionarCalificacion(calificacion: number): void {
    this.nuevaResenia.calificacion = calificacion;
  }
}

