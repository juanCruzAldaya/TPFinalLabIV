import { Injectable } from '@angular/core';

declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    this.loadFacebookSDK();
  }

  loadFacebookSDK(): void {
    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: 'YOUR_APP_ID',
        cookie: true,
        xfbml: true,
        version: 'v10.0'
      });
    };
  }

  signInWithFacebook(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          resolve(response);
        } else {
          reject('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'email,public_profile' });
    });
  }
}
