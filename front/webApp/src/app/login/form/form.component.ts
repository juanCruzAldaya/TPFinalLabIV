import {Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../google-sign-in/google-sign-in.component';
import { AuthServiceFB } from '../facebook-sign-in/facebook-sign-in.component';
import { OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


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
}}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements AfterViewInit, OnInit {
  constructor(private authService: AuthService, private authServiceFB : AuthServiceFB, private fb: FormBuilder, private http: HttpClient) { }
  

  @ViewChild('container') container!: ElementRef;
  @ViewChild('register') registerBtn!: ElementRef;
  @ViewChild('login') loginBtn!: ElementRef;

  ngAfterViewInit() {
    this.registerBtn.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.add('active');
    });

    this.loginBtn.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.remove('active');
    });
  }
  

  onGoogleSignIn(): void {
    this.authService.signInWithGoogle().then(googleUser => {
      console.log('User signed in:', googleUser);
    }).catch(error => {
      console.error("Error during sign-in:", error);
    });
  }
  onFacebookSignIn(): void {
    this.authServiceFB.signInWithFacebook().then(facebookUser => {
      console.log('User signed in with Facebook:', facebookUser);
    }).catch(error => {
      console.error("Error during Facebook sign-in:", error);
    });
  }

  userForm!: FormGroup;
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: matchPasswordsValidator('password', 'confirmPassword') });
  }

  onSubmitLogin(): void {
    if (this.userForm.valid) {
      console.log('Login Form Data:', this.userForm.value);
      // Lógica para iniciar sesión
    }
  }

  onSubmitRegister(): void {
    if (this.registerForm.valid) {
      console.log('Register Form Data:', this.registerForm.value);
      // Lógica para registrarse
    }
  }

}
