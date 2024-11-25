import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ICalendario } from "../../interfaces/calendario.interface";
import { CalendarService } from "../../services/calendar.service";
import { CommonModule } from "@angular/common";

export function matchPasswordsValidator(
  password: string,
  confirmPassword1: string
): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword1);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (
      confirmPasswordControl.errors &&
      !confirmPasswordControl.errors["passwordMismatch"]
    ) {
      console.log("Other validation errors exist on Confirm Password");
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      console.log("Passwords do not match");
      return { passwordMismatch: true };
    } else {
      confirmPasswordControl.setErrors(null);
      console.log("Passwords match");
      return null;
    }
  };
}

@Component({
  selector: "app-form",
  standalone: true,
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
  imports: [ReactiveFormsModule, CommonModule],
})
export class FormComponent implements AfterViewInit, OnInit {
  isRegistering: boolean = false;
  userForm!: FormGroup;
  loginForm!: FormGroup;
  calendario!: ICalendario;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private calendarService: CalendarService
  ) {}

  @ViewChild("container") container!: ElementRef;
  @ViewChild("register") registerBtn!: ElementRef;
  @ViewChild("login") loginBtn!: ElementRef;

  ngOnInit() {
    this.isRegistering = true;
    this.initializeForm();
    this.loginForm = this.fb.group({
      id: "None",
      emailLogin: ["", [Validators.required, Validators.email]],
      passwordLogin: ["", [Validators.required, Validators.minLength(6)]],
      nombre: "None",
      apellido: "None",
      contacto: "None",
      ciudad: "None",
      calificacion_promedio: "None",
    });
  }

  ngAfterViewInit() {
    this.registerBtn.nativeElement.addEventListener("click", () => {
      this.toggleAction();
    });
    this.loginBtn.nativeElement.addEventListener("click", () => {
      this.toggleAction();
    });
  }

  initializeForm(): void {
    const commonControls = {
      id: 0,
      email: ["", [Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    };

    if (this.isRegistering) {
      this.userForm = this.fb.group(
        {
          ...commonControls,
          nombre: null,
          apellido: null,
          contacto: null,
          ciudad: null,
          nacimiento: null,
          calificacion_promedio: 0,
        },
        { validators: matchPasswordsValidator("password", "confirmPassword") }
      );
    } else {
      this.userForm = this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", Validators.required],
        confirmPassword1: ["", Validators.required],
      });
    }
  }

  toggleAction(): void {
    this.isRegistering = !this.isRegistering;
    this.initializeForm();
    this.container.nativeElement.classList.toggle("active", this.isRegistering);
  }

  onGoogleSignIn(): void {
    this.authService
      .signInWithGoogle()
      .then((googleUser) => {
        console.log("User signed in:", googleUser);
        this.router.navigate(["/"]);
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      });
  }

  // onRegister(): void {
  //   console.log("Form Valid:", this.userForm.valid);
  //   console.log("Form Errors:", this.userForm.errors);
  //   console.log("Form Value:", this.userForm.value);

  //   // Log each control's errors
  //   Object.keys(this.userForm.controls).forEach(key => {
  //     const controlErrors = this.userForm.get(key)?.errors;
  //     if (controlErrors) {
  //       console.log(`Control: ${key}, Errors:`, controlErrors);
  //     }
  //   });
  //   console.log(this.userForm.value.email);
  //   if (this.userForm.valid) {
  //     const formData = {
  //       id: this.userForm.value.id,
  //       email: this.userForm.value.email,
  //       password: this.userForm.value.password,
  //       nombre: this.userForm.value.nombre,
  //       apellido: this.userForm.value.apellido,
  //       contacto: this.userForm.value.contacto,
  //       ciudad: this.userForm.value.ciudad,
  //       nacimiento: this.userForm.value.nacimiento,
  //       calificacion_promedio: this.userForm.value.calificacion_promedio,

  //       // Add other fields if needed
  //     };

  //     console.log(formData);
  //     this.http.post('http://localhost:8000/usuarios', formData)
  //       .subscribe(response => {
  //         console.log('User added:', response);
  //         this.router.navigate(['/']);
  //       }, error => {
  //         console.error('Registration failed:', error);
  //         if (error.status === 422) {
  //           console.error('Validation error:', error.error);
  //         }
  //       });
  //   } else {
  //     console.log("Form is invalid, please check the errors above.");
  //   }
  //   this.authService.getLastUserId().subscribe(lastId => {
  //     const newUserId = lastId + 1;
  //     const calendario: Calendario = {
  //       id: 0, // Este campo será asignado por el backend
  //       usuario_id: newUserId,
  //       eventos: []
  //     };

  // }}
  onRegister(): void {
    // Log each control's errors
    Object.keys(this.userForm.controls).forEach((key) => {
      const controlErrors = this.userForm.get(key)?.errors;
      if (controlErrors) {
        console.log(`Control: ${key}, Errors:`, controlErrors);
      }
    });

    if (this.userForm.valid) {
      const formData = {
        id: this.userForm.value.id,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        nombre: this.userForm.value.nombre,
        apellido: this.userForm.value.apellido,
        contacto: this.userForm.value.contacto,
        ciudad: this.userForm.value.ciudad,
        nacimiento: this.userForm.value.nacimiento,
        calificacion_promedio: this.userForm.value.calificacion_promedio,
        // Add other fields if needed
      };

      this.http.post("http://localhost:8000/usuarios", formData).subscribe(
        (user: any) => {
          this.createCalendar();
          console.log("User added:", user);
          this.router.navigate(["/"]);
        },
        (error) => {
          console.error("Registration failed:", error);
          if (error.status === 422) {
            console.error("Validation error:", error.error);
          }
        }
      );
    } else {
      console.log("Form is invalid, please check the errors above.");
    }
  }

  onLogin(): void {
    const email = this.loginForm.get("emailLogin")?.value;
    const password = this.loginForm.get("passwordLogin")?.value;

    if (email && password) {
      this.authService.login(email, password).subscribe(
        (response) => {
          if (response) {
            this.errorMessage = null;
            this.router.navigate(["/home"]);
          }
        },
        (error) => {
          if (error.status === 401) {
            this.errorMessage = "Email o contraseña incorrectos.";
          } else {
            this.errorMessage = "Contraseña incorrecta";
          }
        }
      );
    } else {
      this.errorMessage = "Por favor, completa todos los campos.";
    }
  }
  createCalendar() {
    this.authService.getLastUserId().subscribe({
      next: (response: { id: number }) => {
        const newUserId = response.id;
        const jsonUserId = JSON.stringify({ id: newUserId });
        const parsedUserId = JSON.parse(jsonUserId).id;
        console.log(parsedUserId)
        this.calendario = {
          id: 0,
          usuario_id: parseInt(parsedUserId),
          anio: null,
          mes: null,
        };
        console.log(this.calendario)
        this.calendarService.createCalendar(this.calendario).subscribe(
          (response: ICalendario) => {
            console.log('Calendario created successfully', response);
          },
          (error: any) => {
            console.error('Error creating calendario', error);
          }
        );
      },
      error: (error: any) => {
        console.error('Error fetching last user ID:', error);
      }
    });
  }


}
