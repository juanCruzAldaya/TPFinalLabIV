import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../app/services/auth.service";
import { IService, IServiceFilled } from "../../interfaces/service.interface";
import { SharedModule } from "../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { CategoriesService } from "../../services/categorie-async.service";
import { ICategory } from "../../interfaces/category.interface";
import { ISubCategory } from "../../interfaces/subCategory.interface";
import { ServicesService } from "../../services/service-async.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-my-service-list",
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: "./my-service-list.component.html",
  styleUrls: ["./my-service-list.component.css"],
})
export class MyServiceListComponent implements OnInit {
  categoryList: Array<ICategory> = [];
  subcategoryList: Array<ISubCategory> = [];
  serviceList: IService[] = [];
  servicesFormatted: IServiceFilled[] = [];
  isAuthenticated: boolean = false;
  private authSubscription: Subscription = new Subscription();

  constructor(
    private categoriesService: CategoriesService,
    private servicesService: ServicesService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.authSubscription = this.authService
        .isAuthenticated()
        .subscribe((authStatus: boolean) => {
          this.isAuthenticated = authStatus;
        });
      await this.getServices();
      this.categoryList = await this.categoriesService.getCategories();
      this.subcategoryList = await this.categoriesService.getSubcategories();
      this.mapServices();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async getServices() {
    try {
      this.serviceList = await this.servicesService.getServicesByProfesionalId(
        this.authService.getUserId()
      );


    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }

  navigateToEditService(id: number) {
    this.router.navigate([`/edit-service/${id}`]);
  }

  async removeService(id: number) {
    try {
      await this.servicesService.deleteService(id);
      // Filtra el servicio eliminado de la lista `servicesFormatted`
      this.servicesFormatted = this.servicesFormatted.filter(
        (service) => service.id !== id
      );
      console.log(`Service ${id} removed successfully`);
    } catch (error) {
      console.error("Error removing service:", error);
    }
  }

  mapServices() {
    this.servicesFormatted = this.serviceList.map((service: IService) => {
      const category = this.categoryList.find(
        (cat) => cat.id === service.mainCategory
      );
      const subcategory = this.subcategoryList.find(
        (subcat) => subcat.id === service.secondaryCategory
      );

      return {
        ...service,
        mainCategoryName: category
          ? category.nombre
          : "Categoría no encontrada",
        secondaryCategoryName: subcategory
          ? subcategory.nombre
          : "Subcategoría no encontrada",
        profesionalName: "",
      };
    });
  }
}
