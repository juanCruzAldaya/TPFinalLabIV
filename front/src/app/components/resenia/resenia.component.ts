import { Component, OnInit } from "@angular/core";
import { ReseñasService } from "../../services/resenia.service";
import { IReseña } from "../../interfaces/resenia.interface";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-resenia",
  templateUrl: "./resenia.component.html",
  styleUrls: ["./resenia.component.css"],
})
export class ReseñasComponent implements OnInit {
  resenias: IReseña[] = [];
  nuevaResenia: IReseña = {
    usuario_id: 0,
    servicio_id: 0,
    calificacion: 5,
    comentario: "",
  };

  constructor(private reseñasService: ReseñasService) {}

  ngOnInit(): void {
    const servicio_id = 1;
    this.getResenias(servicio_id);
  }

  getResenias(servicio_id: number): void {
    this.reseñasService.getReseñas(servicio_id).subscribe((data) => {
      this.resenias = data;
    });
  }

  addResenia(): void {
    this.reseñasService.addReseña(this.resenias).subscribe((data) => {
      this.resenias.push(data);
      this.nuevaResenia = {
        usuario_id: 0,
        servicio_id: 0,
        calificacion: 5,
        comentario: "",
      };
    });
  }
  seleccionarCalificacion(calificacion: number): void {
    this.nuevaResenia.calificacion = calificacion;
  }
}
