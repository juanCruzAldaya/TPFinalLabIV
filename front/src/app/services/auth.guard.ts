import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const url = router.routerState.snapshot.url;

  // If logged in and token exists, then return true
  if (authService.token) return true;

  // Store the attempted URL for redirecting
  authService.redirectUrl = url;

  // Navigate to the login page with extras
  router.navigate(["/login"]);

  return false;
};
