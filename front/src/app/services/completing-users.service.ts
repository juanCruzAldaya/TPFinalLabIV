import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IUsuarios } from "../interfaces/users.interfaces";
import { AuthService } from "./auth.services";
import { environment } from "../../enviroments/enviroments";

@Injectable({
  providedIn: "root",
})
export class CompletingUsersService {
  constructor(
    private http: HttpClient,
    private authService: AuthService // Adjust path as needed
  ) {}

  private apiURL = `${environment.LOCAL_API_URL}`;

  updateUser(usuario: IUsuarios): Observable<IUsuarios> {
    usuario.email = this.authService.getUserEmail();
    usuario.password = this.authService.getUserPassword();
    console.log(usuario);
    return this.http.put<IUsuarios>(
      `${this.apiURL}/usuarios/${this.authService.getUserId()}`,
      usuario
    );
  }
}
