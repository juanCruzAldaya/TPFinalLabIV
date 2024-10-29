import { Injectable } from '@angular/core';

declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class AuthServiceFB {

  constructor() {
    this.loadFacebookSDK();
  }

  loadFacebookSDK(): void {
    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: 'EAANPBkCXVwIBOzSUhQMvtuI1QGbPSxR4lqtfQEgRDn7CZA7NLlTZCBU7bmWQdrzlaoIZC45vwNodxB2h4yoylHZAmLEze9BaxB9TdXW5VrFeBTkw8bWlDl1uaAeT8hABoFCznTjxd3Usne6Mpx8ad2ZC4sCYDkCtZCpR5SLPvgd2XXqtM3pLCTVD91agMInkGXUDJ2lEw4KP2srXrSQp8mPB2DU29LIYwJDDP7ZC5nZArVBvlkHJ9JWGyao8uwmtUAZDZD',
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
