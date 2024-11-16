import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ICategory } from "../../interfaces/category.interface";
import { IDepartment } from "../../interfaces/department";
import { ILocality } from "../../interfaces/locality";
import { IProvince } from "../../interfaces/province";
import { IService } from "../../interfaces/service.interface";
import { AuthService } from "../../services/auth.services";
import { CategoriesService } from "../../services/categorie-async.service";
import { LocationAsyncService } from "../../services/location-async.service";
import { ServicesService } from "../../services/service-async.service";
import { ISubCategory } from "../../interfaces/subCategory.interface";
import { SharedModule } from "../../shared/shared.module";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-add-service",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SharedModule],
  templateUrl: "./add-service.component.html",
  styleUrl: "./add-service.component.css",
})
export class AddServiceComponent implements OnInit {
  provinceList: Array<IProvince> = [];
  departmentList: Array<IDepartment> = [];
  localityList: Array<ILocality> = [];
  mainCategoryList: Array<ICategory> = [];
  subCategoryList: Array<ISubCategory> = [];

  resourceForm = new FormGroup({
    description: new FormControl("", [
      Validators.required,
      Validators.maxLength(500),
    ]),
    selectedCategory: new FormControl(""),
    selectedSubCategory: new FormControl(""),
    selectedProvince: new FormControl(this.provinceList, [Validators.required]),
    selectedDepartment: new FormControl(this.departmentList, [
      Validators.required,
    ]),
    selectedLocality: new FormControl(this.localityList, [Validators.required]),
  });

  constructor(
    private locationService: LocationAsyncService,
    private categoriesService: CategoriesService,
    private servicesService: ServicesService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.categoriesService
        .getCategories()
        .then((response) => {
          console.log(response);
          this.mainCategoryList = response;
        })
        .catch((error) => console.log(JSON.stringify(error)));

      this.locationService
        .getAllProvinces()
        .then((response) => {
          this.provinceList = response.provincias;
          // console.log("response.provincias", response.provincias);
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
        });

      this.categoriesService
        .getCategories()
        .then((response) => {
          this.mainCategoryList = response;
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
        });
    } else {
      window.location.href = "/login";
    }
  }

  // Cuando cambia la provincia seleccionada, cargar departamentos
  loadDepartments(provinceName: string) {
    this.locationService
      .getAllDepartmentsByProvince(provinceName)
      .then((response) => {
        // console.log("response.departamentos", response.departamentos);
        this.departmentList = [];
        this.departmentList = response.departamentos;
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  loadLocalities(departmentName: string) {
    this.locationService
      .getAllLocalitiesByDepartments(departmentName)
      .then((response) => {
        // console.log("response.localidades", response.localidades);
        this.localityList = response.localidades;
      })
      .catch((error) => {
        console.log("Ocurrio un error:", JSON.stringify(error));
      });
  }

  loadSubCategoryList(categoryId: number) {
    this.categoriesService
      .getSubCategoriesById(categoryId)
      .then((response) => {
        console.log(response);
        this.subCategoryList = response;
      })
      .catch((error) => console.log(JSON.stringify(error)));
  }

  onSelectedProvince() {
    this.departmentList = []; // Limpia los departamentos al cambiar la provincia
    this.localityList = []; // Limpia las localidades al cambiar la provincia
    const province = new Object(
      this.resourceForm.getRawValue().selectedProvince
    ) as IProvince;
    this.loadDepartments(province.nombre);
  }

  onSelectedDepartment() {
    this.localityList = []; // Limpia las localidades al cambiar el departamento
    const department = new Object(
      this.resourceForm.getRawValue().selectedDepartment
    ) as IDepartment;
    this.loadLocalities(department.nombre);
  }

  onSelectedCategory() {
    const category = new Object(
      this.resourceForm.getRawValue().selectedCategory
    ) as ICategory;
    console.log(category);
    console.log(category.id);
    this.loadSubCategoryList(category.id);
  }

  showSuccess() {
    this.toastr.success("Se creo el servicio exitosamente!");
  }
  showError() {
    this.toastr.error("Algo salio mal");
  }

  onSubmit() {
    let service: IService = {
      id: 0,
      description: "",
      mainCategory: 0,
      secondaryCategory: 0,
      state: "",
      department: "",
      locality: "",
      profesionalId: 0,
    };
    const description = this.resourceForm.getRawValue().description as string;
    const mainCategory = new Object(
      this.resourceForm.getRawValue().selectedCategory
    ) as ICategory;
    const secondaryCategory = new Object(
      this.resourceForm.getRawValue().selectedSubCategory
    ) as ICategory;
    const province = new Object(
      this.resourceForm.getRawValue().selectedProvince
    ) as IProvince;
    const department = new Object(
      this.resourceForm.getRawValue().selectedDepartment
    ) as IDepartment;
    const locality = new Object(
      this.resourceForm.getRawValue().selectedLocality
    ) as ILocality;
    const profesionalId = this.authService.getUserId();

    service.description = description;
    service.mainCategory = mainCategory.id;
    service.secondaryCategory = secondaryCategory.id;
    service.state = province.nombre;
    service.department = department.nombre;
    service.locality = locality.nombre;
    service.profesionalId = parseInt(profesionalId); //aca necesito traerme el id del usuario actual

    this.servicesService
      .addService(service)
      .then()
      .then(() => this.showSuccess())
      .catch((error) => {
        this.showError();
        console.log(error);
      });

    this.resourceForm.reset();
  }
}
