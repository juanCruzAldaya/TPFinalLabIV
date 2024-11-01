import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})



export class HeaderComponent {
  isAuthenticated = false;
  @Input() showSearch: boolean = true;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAuthenticated().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    });
  }





  navigateHome() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']); } 
    else { 
      this.router.navigate(['/login']); } 
    }


  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  

}
