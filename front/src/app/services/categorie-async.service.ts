import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../enviroments/enviroments";
import { ISubCategory } from "../interfaces/subCategory.interface";
import { ICategory } from "../interfaces/category.interface";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories(): Promise<ICategory[] | any> {
    return this.http.get(`${environment.LOCAL_API_URL}/categorias`).toPromise();
  }

  getSubCategoriesById(id: number): Promise<ISubCategory[] | any> {
    return this.http
      .get(`${environment.LOCAL_API_URL}/subcategoriasById/${id}`)
      .toPromise();
  }

  getCategory(id: number): Promise<ICategory[] | any> {
    return this.http
      .get(`${environment.LOCAL_API_URL}/categoria/${id}`)
      .toPromise();
  }

  getSubCategory(id: number): Promise<ISubCategory[] | any> {
    return this.http
      .get(`${environment.LOCAL_API_URL}/subcategoria/${id}`)
      .toPromise();
  }

  getSubcategories(): Promise<any> {
    return this.http
      .get(`${environment.LOCAL_API_URL}/subcategorias`)
      .toPromise();
  }
}
