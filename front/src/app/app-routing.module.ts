import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePageComponent } from "./components/home/home-page/home-page.component";
import { FormComponent } from "./components/login/form/form.component";
import { ServiceListComponent } from "./components/filter-services/service-list/service-list.component";
import { BookingFormComponent } from "./components/filter-services/booking-form/booking-form.component";
import { InfoComponent } from "./components/complet_user/info.component";
import { AddServiceComponent } from "./components/add-service/add-service.component";

const routes: Routes = [
  { path: "search-professionals", component: ServiceListComponent },
  { path: "", component: HomePageComponent },
  { path: "booking-form", component: BookingFormComponent },
  { path: "complete_user/:id", component: InfoComponent },
  { path: "login", component: FormComponent },
  { path: "add-service", component: AddServiceComponent },
  { path: "**", component: HomePageComponent },

  // otras rutas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
