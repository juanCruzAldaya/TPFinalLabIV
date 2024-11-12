import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.services";

import { FilterServicesService } from "../../services/filter-services.service";
import { IService, IServiceFilled } from "../../interfaces/service.interface";

@Component({
  selector: "app-my-service-list",
  templateUrl: "./service-list.component.html",
  styleUrls: ["./service-list.component.css"],
})
export class MyServiceListComponent implements OnInit {
  private myServiceList: Array<any> = [];
  private servicesFormattedArray: Array<IServiceFilled> = [];

  constructor(
    private filterService: FilterServicesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.filterService
      .getServicesByProfesionalId(this.authService.getUserId())
      .subscribe(
        (data: IService[]) => {
          this.myServiceList = data;
          this.loadAdditionalData();
        },
        (error) => {
          console.error("Error fetching services:", error);
        }
      );
  }

  loadAdditionalData(): void {
    let filledService: IServiceFilled;
    this.myServiceList.forEach((service: IService) => {
      filledService = {
        ...service,
        category_name: "",
        subCategory_name: "",
        profesional_name: "",
      };
      this.filterService
        .getCategoria(service.mainCategory)
        .subscribe((categoria) => {
          filledService.category_name = categoria.nombre;
        });
      this.filterService
        .getSubCategoria(service.secondaryCategory)
        .subscribe((subCategoria) => {
          filledService.subCategory_name = subCategoria.nombre;
        });
      this.filterService
        .getProfesional(service.profesionalId)
        .subscribe((profesional) => {
          filledService.profesional_name = `${profesional.nombre} ${profesional.apellido}`;
        });
      this.servicesFormattedArray.push(filledService);
    });
  }
}
