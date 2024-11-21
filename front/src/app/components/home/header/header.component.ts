import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { IUsuarios } from "../../../interfaces/users.interfaces";
import { CompletingUsersService } from "../../../services/completing-users.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  isAuthenticated = false;
  @Input() showSearch: boolean = true;

  constructor(private authService: AuthService, private router: Router,private servis :CompletingUsersService) {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
    });
  }

  logOut() {
    return this.authService.logout();
  }

  navigateHome() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/home"]);
    } else {
      this.router.navigate(["/login"]);
    }
  }

  navigateToProfile() {
    this.router.navigate(["/profile"]);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  ngOnInit(): void {
    this.loadUserData();
  }
    user : IUsuarios | undefined ;
    loadUserData(): void {
      const userId = this.authService.getUserId();
      this.servis.getUserData(userId).subscribe(
        (usuario: IUsuarios) => {
          this.user = usuario; // Asegúrate de que `profileImageUrl` esté en la respuesta
        },
        error => {
          console.error('Error al cargar los datos del usuario:', error);
        }
      );
    }
    
    
}
