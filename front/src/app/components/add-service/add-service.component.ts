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
import { IService, IServiceFilled } from "../../interfaces/service.interface";
import { AuthService } from "../../services/auth.services";
import { CategoriesService } from "../../services/categorie-async.service";
import { LocationAsyncService } from "../../services/location-async.service";
import { ServicesService } from "../../services/service-async.service";
import { ISubCategory } from "../../interfaces/subCategory.interface";
import { SharedModule } from "../../shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

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
  resourceForm!: FormGroup;
  isAuthenticated: boolean = false;
  private authSubscription: Subscription = new Subscription();
  myService: IService = {
    id: 0,
    descripcion: "",
    categoria: 0,
    sub_categoria: 0,
    provincia: "",
    departamento: "",
    localidad: "",
    profesional_id: 0,
  };

  constructor(
    private locationService: LocationAsyncService,
    private categoriesService: CategoriesService,
    private servicesService: ServicesService,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService
      .isAuthenticated()
      .subscribe((authStatus: boolean) => {
        this.isAuthenticated = authStatus;
      });
    const id = this.route.snapshot.paramMap.get("id");
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
      this.initializeForm(id);
    } else {
      window.location.href = "/login";
    }
  }

  initializeForm(id: string | null) {
    if (id) {
      this.servicesService
        .getService(parseInt(id))
        .then((response) => {
          console.log("response", response);
          this.myService = response;
        })
        .catch((error) => {
          console.log(error);
        });
      console.log("servicio", this.myService);
      this.resourceForm = new FormGroup({
        description: new FormControl(this.myService.descripcion, [
          Validators.required,
          Validators.maxLength(500),
        ]),
        selectedCategory: new FormControl(this.myService.categoria),
        selectedSubCategory: new FormControl(this.myService.sub_categoria),
        selectedProvince: new FormControl(this.myService.provincia, [
          Validators.required,
        ]),
        selectedDepartment: new FormControl(this.myService.departamento, [
          Validators.required,
        ]),
        selectedLocality: new FormControl(this.myService.localidad, [
          Validators.required,
        ]),
      });
    } else {
      this.resourceForm = new FormGroup({
        description: new FormControl("", [
          Validators.required,
          Validators.maxLength(500),
        ]),
        selectedCategory: new FormControl(""),
        selectedSubCategory: new FormControl(""),
        selectedProvince: new FormControl(this.provinceList, [
          Validators.required,
        ]),
        selectedDepartment: new FormControl(this.departmentList, [
          Validators.required,
        ]),
        selectedLocality: new FormControl(this.localityList, [
          Validators.required,
        ]),
      });
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
      id: 1,
      descripcion: "",
      categoria: 0,
      sub_categoria: 0,
      provincia: "",
      departamento: "",
      localidad: "",
      profesional_id: 0,
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

    service.descripcion = description;
    service.categoria = mainCategory.id;
    service.sub_categoria = secondaryCategory.id;
    service.provincia = province.nombre;
    service.departamento = department.nombre;
    service.localidad = locality.nombre;
    service.profesional_id = parseInt(profesionalId); //aca necesito traerme el id del usuario actual

    console.log("SERVICIO: ", service);
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
