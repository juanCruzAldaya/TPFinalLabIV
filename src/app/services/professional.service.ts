// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Professional } from '../interfaces/Users.interfaces';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProfessionalService {
//   private apiUrl = 'http://127.0.0.1:8000/profesionales'; // Replace with your actual API URL

//   constructor(private http: HttpClient) {}

//   getProfessionals(): Observable<Professional[]> {
//     return this.http.get<Professional[]>(this.apiUrl);
//   }
// }