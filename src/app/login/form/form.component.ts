import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';

export function matchPasswordsValidator(password: string, confirmPassword: string): ValidatorFn {
  return (formGroup: AbstractControl) => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);
    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }
    const error = passwordControl.value === confirmPasswordControl.value ? null : { passwordMismatch: true };
    confirmPasswordControl.setErrors(error);
    return error;
  };
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements AfterViewInit, OnInit {
  isRegistering: boolean = false;
  userForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  @ViewChild('container') container!: ElementRef;
  @ViewChild('register') registerBtn!: ElementRef;
  @ViewChild('login') loginBtn!: ElementRef;

  ngOnInit(): void {
    this.initializeForm();
  }

  ngAfterViewInit() {
    this.registerBtn.nativeElement.addEventListener('click', () => {
      this.toggleAction();
    });
    this.loginBtn.nativeElement.addEventListener('click', () => {
      this.toggleAction();
    });
  }

  initializeForm(): void {
    if (this.isRegistering) {
      this.userForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      }, { validator: matchPasswordsValidator('password', 'confirmPassword') });
    } else {
      this.userForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
    }
  }

  toggleAction(): void {
    this.isRegistering = !this.isRegistering;
    this.initializeForm();
    this.container.nativeElement.classList.toggle('active', this.isRegistering);
  }

  onGoogleSignIn(): void {
    this.authService.signInWithGoogle().then(googleUser => {
      console.log('User signed in:', googleUser);
      this.router.navigate(['/']);
    }).catch(error => {
      console.error("Error during sign-in:", error);
    });
  }

  onRegister(): void {
    console.log(this.userForm.value)
    if (this.userForm.valid) {
      console.log("asdasd")
      this.http.post('http://localhost:8000/users_incompletos', this.userForm.value)
        .subscribe(response => {
          console.log('User added:', response);
          this.router.navigate(['/']);
        });
    }
  }

  onLogin(): void {
    const { email, password } = this.userForm.value;

    this.authService.login(email, password).subscribe(
      response => {
        if (response !=undefined
        ) {
          this.router.navigate(['/home']);
        }
      },
      error => {
        console.error('Login failed:', error);
      }
    );
  }
}
