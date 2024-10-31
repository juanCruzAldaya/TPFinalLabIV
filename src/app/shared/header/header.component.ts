import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAuthenticated().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
