import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../enviroments/enviroments";
import { SubCategory } from "../interfaces/subCategory.interface";
import { Category } from "../interfaces/category.interface";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  private apiUrl = environment.LOCAL_API_URL;

  constructor(private http: HttpClient) {}

  getCategories(): Promise<Category[] | undefined> {
    return this.http.get(`${this.apiUrl}/categoria`).toPromise();
  }
  getSubCategories(id: number): Promise<SubCategory[] | undefined> {
    return this.http.get(`${this.apiUrl}/subCategoria/${id}`).toPromise();
  }
}
