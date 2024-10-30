// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  login() {
    // Lógica de login
    this.authStatus.next(true);
  }

  logout() {
    // Lógica de logout
    this.authStatus.next(false);
  }
}


