import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';

export function matchPasswordsValidator(password: string, confirmPassword1: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword1);

    if (!passwordControl || !confirmPasswordControl) {
      console.log("Password or Confirm Password control is missing");
      return null;
    }

    if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
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


  ngOnInit() {
    this.isRegistering = true; 
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
    const commonControls = {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    };
  
    if (this.isRegistering) {
      this.userForm = this.fb.group({
        ...commonControls,
        confirmPassword1: ['', Validators.required]
      }, { validators: matchPasswordsValidator('password', 'confirmPassword') });
    } else {
      this.userForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
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
    console.log("Form Valid:", this.userForm.valid);
    console.log("Form Errors:", this.userForm.errors);
    console.log("Form Value:", this.userForm.value);
  
    // Log each control's errors
    Object.keys(this.userForm.controls).forEach(key => {
      const controlErrors = this.userForm.get(key)?.errors;
      if (controlErrors) {
        console.log(`Control: ${key}, Errors:`, controlErrors);
      }
    });
  
    if (this.userForm.valid) {
      const formData = {
        id: 0,
        email: this.userForm.value.email,
        password: this.userForm.value.password
      };
  
      this.http.post('http://localhost:8000/users_incompletos', formData)
        .subscribe(response => {
          console.log('User added:', response);
          this.router.navigate(['/']);
        }, error => {
          console.error('Registration failed:', error);
          if (error.status === 422) {
            console.error('Validation error:', error.error);
          }
        });
    } else {
      console.log("Form is invalid, please check the errors above.");
    }
  }
  
  onLogin(): void {
    console.log("Form Value:", this.userForm.value);
    const email = this.userForm.get('email')?.value;
    const password = this.userForm.get('password')?.value;
  
    if (email && password) {
      this.authService.login(0,email, password).subscribe(
        response => {
          if (response) {
            this.router.navigate(['/home']);
          }
        },
        error => {
          console.error('Login failed:', error);
        }
      );
    } else {
      console.error('Email or password is missing');
    }
  }
  
}
