import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { map, tap } from 'rxjs/operators';


interface AuthResponse {
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://127.0.0.1:8000';
  private userId: string | null = null;


  constructor(private http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }



  
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('http://127.0.0.1:8000/login', { email, password }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          
          console.log(response) // Almacenar el ID del usuario
          
          this.authStatus.next(true);
        }
      }),
      catchError(error => {
        console.error('Login error', error);
        this.authStatus.next(false);
        throw error;
      })
    );
  }
  
  getUserId(): string | null {
    return this.userId || localStorage.getItem('userId');
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

