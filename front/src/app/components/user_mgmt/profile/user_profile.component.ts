import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.services';
import { Router } from '@angular/router';
import { CompletingUsersService } from '../../../services/completing-users.service';
import { IUsuarios } from '../../../interfaces/users.interfaces';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user_profile.component.html',
  styleUrls: ['./user_profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router,private servis: CompletingUsersService,) {
  }
  ngOnInit(): void {
    this.loadUserData();
  }
    user : IUsuarios | undefined ;
    loadUserData(): void {
      const userId = this.authService.getUserId();
      console.log(userId);
      this.servis.getUserData(userId).subscribe(
        (usuario: IUsuarios) => {
          this.user=usuario;
        },
        error => {
          console.error('Error al cargar los datos del usuario:', error);
        }
      );
    }
    
    navigateToCompleteUser() {
      this.router.navigate([`/complete_user/${this.authService.getUserId()}`]);
    }
    navigateTo(route: string) {
      this.router.navigate([route]);
    }
}
