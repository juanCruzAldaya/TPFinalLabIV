import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServices {
  private Url = "http://127.0.0.1:8000";

  constructor(private http: HttpClient) {}

  getAllEmail(): Promise<any> {
    return this.http.get(this.Url).toPromise();
  }
  checkEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.Url}?email=${email}`);
  }

}
