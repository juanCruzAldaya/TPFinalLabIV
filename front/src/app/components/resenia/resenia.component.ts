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
    const service_id = shared.getServiceId()
    console.log(service_id)
    this.reviewForm = this.fb.group({
      cliente_id: [parseInt(auth.getUserId()), Validators.required], 
      servicio_id: [service_id, Validators.required], 
      calificacion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', [Validators.required]], //Validators.minLength(10)
    });
  }

  ngOnInit(): void {
    this.getReviews();
    
  }

  // Método para enviar una nueva reseña
  submitReview(): void {
    if (this.reviewForm.valid) {
      
      
      const reviewData: IReseña = {
        calificacion: this.reviewForm.value.calificacion,
        comentario: this.reviewForm.value.comentario,
        fecha: new Date().toISOString().split('T')[0], // This will give you "2024-11-20",
        id: 0,
        servicio_id: this.shared.getServiceId(),
        cliente_id: this.reviewForm.value.cliente_id,     
        };
      
      console.log(reviewData);
      this.reseñasService.submitReview(reviewData).subscribe(() => {
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


