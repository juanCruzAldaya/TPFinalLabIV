import { Component, OnInit } from "@angular/core";
import { CompletingUsersService } from "../services/completing-users.service";
import { IUsuarios } from "../../interfaces/users.interfaces";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.services";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.css"],
})
export class InfoComponent implements OnInit {
  formGroup!: FormGroup;
  isCompleting: boolean = false;

  constructor(
    private servis: CompletingUsersService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  // Inicializa el formulario con las validaciones necesarias
  initializeForm(): void {
    this.formGroup = this.fb.group({
      id: [0],
      nombre: ["", Validators.required],
      apellido: ["", Validators.required],
      contacto: ["", Validators.required],
      nacimiento: ["", Validators.required],
      ciudad: ["", Validators.required],
      calificacion_promedio: [0],
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const usuario: IUsuarios = {
        id: this.authService.getUserId(),
        nombre: this.formGroup.get("nombre")?.value,
        apellido: this.formGroup.get("apellido")?.value,
        contacto: this.formGroup.get("contacto")?.value,
        nacimiento: this.formGroup.get("nacimiento")?.value,
        ciudad: this.formGroup.get("ciudad")?.value,
        calificacion_promedio: this.formGroup.get("calificacion_promedio")
          ?.value,
      };
      this.servis.updateUser(usuario).subscribe(
        (data) => {
          console.log("Usuario completado y enviado:", data);
        },
        (error) => {
          console.error("Error al enviar el usuario:", error);
        }
      );
    } else {
      console.log("Formulario no valido");
    }
  }
}
