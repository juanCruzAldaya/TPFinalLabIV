import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../enviroments/enviroments";
import { ISubCategory } from "../../interfaces/subCategory.interface";
import { ICategory } from "../../interfaces/category.interface";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  private apiUrl = environment.LOCAL_API_URL;

  constructor(private http: HttpClient) {}

  getCategories(): Promise<ICategory[] | any> {
    return this.http.get(`${this.apiUrl}/categorias`).toPromise();
  }
  getSubCategories(id: number): Promise<ISubCategory[] | any> {
    return this.http.get(`${this.apiUrl}/subcategorias/${id}`).toPromise();
  }
}