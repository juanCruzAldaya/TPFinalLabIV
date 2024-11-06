  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Usuarios } from "../interfaces/Users.interfaces"


  @Injectable({
    providedIn: 'root'
  })
  export class CompletingUsersService {

    constructor(
      private http: HttpClient,
    ) { }

    private apiURL ="http://127.0.0.1:8000/usuarios";

    postUser(usuario: Usuarios): Observable<Usuarios> {
      return this.http.post<Usuarios>(this.apiURL, usuario);
    }
  }
