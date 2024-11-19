import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'  // Adjust path as needed



@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) { // Método para verificar si el usuario está autenticado
      return true;
    } else {
      this.router.navigate(['/login']); // Redirigir a login si no está autenticado
      return false;
    }
  }
}
