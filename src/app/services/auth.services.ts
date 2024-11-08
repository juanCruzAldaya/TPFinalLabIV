import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError  } from 'rxjs';
import { map, tap } from 'rxjs/operators';


interface AuthResponse {
  token: string;
  userId: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://127.0.0.1:8000';
  private userId: number | null = null;


  constructor(private http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }



  
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl + '/login', { email, password }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          this.userId = response.userId; // Store userId for future requests
          this.authStatus.next(true);
        }
      }),
      catchError(error => {
        console.error('Login error', error);
        this.authStatus.next(false);
        return throwError(error);
      })
    );
  }

  


  getUserId(): string | null {
    return this.userId ? this.userId.toString() : localStorage.getItem('userId'); // Ensure userId is a string
  }
  logout() {
    this.authStatus.next(false);
  }

  signInWithGoogle(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulación de autenticación
      resolve({ user: 'Google User' });
    });
  }

  }

