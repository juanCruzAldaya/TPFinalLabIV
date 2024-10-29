import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Resource } from "../../models/resource";
import { Province } from "../../models/province";
import { LocationAsyncService } from "../../services/location-async.service";
import { Department } from "../../models/department";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-add-resource",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./add-resource.component.html",
  styleUrl: "./add-resource.component.css",
})
export class AddResourceComponent implements OnInit {
  provinceList: Array<Province> = [];

  resourceForm = new FormGroup({
    price: new FormControl(""),
    description: new FormControl(""),
    province: new FormControl(this.provinceList),
    municipality: new FormControl(""),
    locality: new FormControl(""),
  });

  constructor(private locationService: LocationAsyncService) {}

  ngOnInit() {
    this.locationService
      .getAllProvinces()
      .then((response) => {
        this.provinceList = response.provincias;
        console.log("response.provincias", response.provincias);
      })
      .catch((error) => {
        console.log(error);
      });
    const province = this.resourceForm?.get("province")?.value;
    this.locationService
      .getAllMunicipalitiesByProvince("Buenos Aires")
      .then((response) => {
        console.log("response.municipios:", response);
      });
  }

  onSubmit() {
    let resource = new Resource();
    resource.price = this.resourceForm.get("price")?.value!;
  }
}
