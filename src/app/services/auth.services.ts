import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }



  login(id: number, email: string, password: string): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/login', {id, email, password })
      .pipe(
        tap(response => {
            if (response != undefined){
              this.authStatus.next(true);
              
            }
          }
        )
      );
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
