import { Component, OnInit } from '@angular/core';
import { CompletingUsersService } from '../services/completing-users.service';
import { Usuarios } from "../interfaces/Users.interfaces";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  formGroup!: FormGroup;
  isCompleting: boolean = false;

  constructor(
    private services: CompletingUsersService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  // Inicializa el formulario con las validaciones necesarias
  initializeForm(): void {
    this.formGroup = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      contacto: ['', Validators.required],
      // nacimiento: ['', Validators.required],
      ciudad: ['', Validators.required],
      calificacion_promedio: [null]
    });
  }

  onCompleting(): void {
    if (this.formGroup.valid) {
      const usuario: Usuarios = {
        nombre: this.formGroup.get('nombre')?.value,
        apellido: this.formGroup.get('apellido')?.value,
        contacto: this.formGroup.get('contacto')?.value,
        // nacimiento: this.formGroup.get('nacimiento')?.value,
        ciudad: this.formGroup.get('ciudad')?.value,
        calificacion_promedio: this.formGroup.get('calificacion_promedio')?.value
      };
      this.services.postUser(usuario).subscribe(
        data => {
          console.log('Usuario completado y enviado:', data);
        },
        error => {
          console.error('Error al enviar el usuario:', error);
        }
      );
    } else {
      console.log('Formulario no valido');
    }
  }
  
}
