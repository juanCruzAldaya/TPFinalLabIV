import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.services";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  isAuthenticated = false;
  @Input() showSearch: boolean = true;

  constructor(private authService: AuthService, private router: Router) {
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

  navigateToCompleteUser() {
    this.router.navigate([`/complete_user/${this.authService.getUserId()}`]);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
