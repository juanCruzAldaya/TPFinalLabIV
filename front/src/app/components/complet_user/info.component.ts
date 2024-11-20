import { Component, OnInit } from '@angular/core';
import { CompletingUsersService } from '../services/completing-users.service';
import { Usuarios } from "../interfaces/users.interfaces";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.services';


export function mayorEdad(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaNacimiento = new Date(control.value);
    const fechaActual = new Date();
    
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    

    const mes = fechaActual.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    
    return edad >= 18 ? null : { mayorEdad: true };
  };
}
export function validarTelefono(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const telefono = control.value;
    // Verifica que el número tenga exactamente 10 dígitos
    const esValido = /^\d{10}$/.test(telefono);
    return esValido ? null : { telefonoInvalido: true };
  };
}
export function soloLetras(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const soloLetrasRegex = /^[a-zA-Z\s]+$/;
    const esValido = soloLetrasRegex.test(control.value);
    return esValido ? null : { soloLetras: true };
  };
}


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  formGroup!: FormGroup;
  isCompleting: boolean = false;

  constructor(
    private servis: CompletingUsersService,
    private fb: FormBuilder, 
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  // Inicializa el formulario con las validaciones necesarias
  initializeForm(): void {
    this.formGroup = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, soloLetras()]],
      apellido: ['', [Validators.required, soloLetras()]],
      contacto: ['', [Validators.required, validarTelefono()]],
      nacimiento: ['', [Validators.required,mayorEdad()]],
      ciudad: ['', Validators.required],
      calificacion_promedio: [0]
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const usuario: Usuarios = {
        id: this.authService.getUserId(),
        nombre: this.formGroup.get('nombre')?.value,
        apellido: this.formGroup.get('apellido')?.value,
        contacto: this.formGroup.get('contacto')?.value,
        nacimiento: this.formGroup.get('nacimiento')?.value,
        ciudad: this.formGroup.get('ciudad')?.value,
        calificacion_promedio: this.formGroup.get('calificacion_promedio')?.value
      };
      this.servis.updateUser(usuario).subscribe(
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