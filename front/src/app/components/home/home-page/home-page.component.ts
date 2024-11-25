import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"], // Corrected to styleUrls
})
export class HomePageComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private authSubscription: Subscription = new Subscription(); // Initialize with an empty subscription

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService
      .isAuthenticated()
      .subscribe((authStatus: boolean) => {
        this.isAuthenticated = authStatus;
      });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
