import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError, map } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "../../enviroments/enviroments";

interface AuthResponse {
  token: string;
  userId: any;
  email: string;
  password: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);
  private userId: number | null = null;
  private email: string | null = null;
  private password: string | null = null;
  token?: string = undefined;
  redirectUrl: string = "/login";

  constructor(private http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.LOCAL_API_URL}/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      )
      .pipe(
        tap((response: AuthResponse) => {
          if (response && response.token) {
            this.token = response.token;
            sessionStorage.setItem("token", response.token);
            sessionStorage.setItem("userId", response.userId);
            sessionStorage.setItem("email", response.email);
            sessionStorage.setItem("password", response.password);
            this.userId = response.userId; // Store userId for future requests
            this.email = response.email;
            this.password = response.password;
            this.authStatus.next(true);
          }
        }),
        catchError((error) => {
          console.error("Login error", error);
          this.authStatus.next(false);

          // Personalizar el mensaje de error
          if (error.status === 401) {
            return throwError(() => new Error("Credenciales incorrectas."));
          }
          return throwError(() => new Error("Error de conexión al servidor."));
        })
      );
  }

  getUserId(): any {
    return this.userId
      ? this.userId.toString()
      : sessionStorage.getItem("userId"); // Ensure userId is a string
  }

  getUserEmail(): string | null {
    return this.email ? this.email : sessionStorage.getItem("email");
  }

  getUserPassword(): string | null {
    return this.password ? this.password : sessionStorage.getItem("password");
  }

  logout() {
    this.authStatus.next(false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("password");
    this.userId = null;
    this.email = null;
    this.password = null;
    this.token = undefined;
  }

  signInWithGoogle(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulación de autenticación
      resolve({ user: "Google User" });
    });
  }
  getLastUserId(): Observable<{ id: number }> {
    return this.http
      .get<{ id: number }>(environment.LOCAL_API_URL + "/ultimo_id")
      .pipe(
        catchError((error) => {
          console.error("Error fetching last user ID:", error);
          return throwError(error);
        })
      );
  }
}
