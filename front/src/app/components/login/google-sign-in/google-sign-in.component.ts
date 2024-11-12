import { Injectable } from '@angular/core';

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signInWithFacebook() {
    throw new Error('Method not implemented.');
  }

  constructor() {
    this.loadGoogleAuth();
  }

  loadGoogleAuth(): void {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: '1066756556925-6gp8n1heecaf36k0v2gl6fnu9g7k85et.apps.googleusercontent.com'
      });
    });
  }

  signInWithGoogle(): Promise<any> {
    const authInstance = gapi.auth2.getAuthInstance();
    return authInstance.signIn();
  }
}
