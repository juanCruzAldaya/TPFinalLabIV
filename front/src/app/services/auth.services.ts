import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
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
  private apiUrl = `${environment.LOCAL_API_URL}`;
  private userId: number | null = null;
  private email: string | null = null;
  private password: string | null = null;

  constructor(private http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          console.log(response)
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('email', response.email);
          localStorage.setItem('password', response.password);
          this.userId = response.userId; // Store userId for future requests
          this.email = response.email;
          this.password = response.password;
          this.authStatus.next(true);
        }
      }),
        catchError((error) => {
          console.error("Login error", error);
          this.authStatus.next(false);
          return throwError(error);
        })
      );
  }

  getUserId(): any {
    return this.userId ? this.userId.toString() : localStorage.getItem('userId'); // Ensure userId is a string
  }

  getUserEmail(): string | null {
    return this.email ? this.email : localStorage.getItem("email");
  }

  getUserPassword(): string | null {
    return this.password ? this.password : localStorage.getItem("password");
  }

  logout() {
    this.authStatus.next(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    this.userId = null;
    this.email = null;
    this.password = null;
  }

  signInWithGoogle(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulación de autenticación
      resolve({ user: "Google User" });
    });
  }
  getLastUserId(): Observable<number> {
    return this.http.get<{ id: number }>(`${this.apiUrl}/usuarios/ultimo_id`).pipe(
      map(response => {
        if (response && response.id !== undefined) {
          return response.id;
        } else {
          throw new Error('Invalid response format');
        }
      }),
      tap(lastId => {
        
        localStorage.setItem('lastUserId', lastId.toString());
      }),  // Store lastUserId for future requests
      catchError(error => {
        console.error('Get last user id error', error);
        return throwError(error);
      }),
    );
  }

}
