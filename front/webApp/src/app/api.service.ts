import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl="https://apis.google.com/js/platform.js";
  constructor(private http: HttpClient) { }

}
