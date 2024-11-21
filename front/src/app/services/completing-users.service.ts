import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.services";
import { environment } from "../../enviroments/enviroments";
import { IUsuarios } from "../interfaces/users.interfaces";

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
    return this.http.put<IUsuarios>(
      `${environment.LOCAL_API_URL}/usuarios/${this.authService.getUserId()}`,
      usuario
    );
  }
  getUserData(userId: number): Observable<IUsuarios> {
    return this.http.get<IUsuarios>(`${this.apiURL}/usuariosC/${userId}`);
  }
  deleteUser(userId: number): Observable<IUsuarios> {
    return this.http.delete<IUsuarios>(`${this.apiURL}/usuarios/${userId}`);
  }
}
