import {Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../google-sign-in/google-sign-in.component';
// import { AuthService } from '../facebook-sign-in/facebook-sign-in.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements AfterViewInit {

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
  constructor(private authService: AuthService) { }

  onGoogleSignIn(): void {
    this.authService.signInWithGoogle().then(googleUser => {
      console.log('User signed in:', googleUser);
    }).catch(error => {
      console.error("Error during sign-in:", error);
    });
  }
  // onFacebookSignIn(): void {
  //   this.authService.signInWithFacebook().then(response => {
  //     console.log('User signed in with Facebook:', response);
  //   }).catch(error => {
  //     console.error("Error during Facebook sign-in:", error);
  //   });
  // }
}
