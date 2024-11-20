import { Component, OnInit } from "@angular/core";
import { ReseñasService } from "../../services/resenia.service";
import { IReseña } from "../../interfaces/resenia.interface";
import { FormBuilder, FormGroup, FormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { SharedService } from "../../services/shared.service";
import { ContractsService } from "../../services/contracts.service";
// import {}

@Component({
  selector: "app-resenia",
  templateUrl: "./resenia.component.html",
  styleUrls: ["./resenia.component.css"],
})
export class ReseñasComponent implements OnInit {
  resenias: IReseña[] = [];
  reviewForm: FormGroup;

  constructor(
    private reseñasService: ReseñasService,
    private fb: FormBuilder,
    private auth :AuthService,
    private shared :SharedService,
    private contractsService: ContractsService,
  ) {
    console.log("servicio id: "+shared.getServiceId())
    this.reviewForm = this.fb.group({
      usuario_id: [auth.getUserId, Validators.required], 
      // servicio_id: [shared.getServiceId, Validators.required], 
      servicio_id: [48, Validators.required], 
      calificacion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ["", [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.getReviews();
    
  }

  // Método para enviar una nueva reseña
  submitReview(): void {
    if (this.reviewForm.valid) {
      const review: IReseña = this.reviewForm.value;
      this.reseñasService.submitReview(review).subscribe(() => {
        alert("Reseña enviada correctamente");
        this.getReviews(); 
        this.reviewForm.reset({ calificacion: 5, comentario: "" }); 
      });
    } else {
      alert("Por favor, completa todos los campos correctamente.");
    }
  }

  
  getReviews(): void {
    const services_id =this.shared.getServiceId();
    this.reseñasService.getReviews(services_id).subscribe((data: IReseña[]) => {
      this.resenias = data;
    });
  }
  seleccionarCalificacion(calificacion: number): void {
    this.reviewForm.patchValue({ calificacion });
  }
}