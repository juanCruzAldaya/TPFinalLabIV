import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ /* decorator marks the class as a service that can be injected into other components or services.*/
  providedIn: 'root'/*part tells Angular that this service should be provided in the root injector, making it a singleton and available throughout the entire application.*/
})
export class AuthService {
  constructor(private router: Router) {}

  login(username: string, password: string) { //s a parameter that means when AuthService is instantiated, an instance of the Angular Router is injected into it. The private keyword creates a private member variable router within the class that can be used in the class methods to navigate between routes.
    // lógica de autenticación aquí
    this.router.navigate(['/']); // redirige a la página de inicio después de la autenticación
  }
}


