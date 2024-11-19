import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePageComponent } from "./components/home/home-page/home-page.component";
import { ServiceListComponent } from "./components/filter-services/service-list/service-list.component";
import { BookingFormComponent } from "./components/filter-services/booking-form/booking-form.component";
import { InfoComponent } from "./components/user_mgmt/complete_user/info.component";
import { AddServiceComponent } from "./components/add-service/add-service.component";
import { FormComponent } from "./components/login/form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { ReseñasComponent } from "./components/resenia/resenia.component";
import { AuthGuard } from './services/auth.guard';
import { ContractsComponent } from "./components/contracts/contracts.component";
import { ProfileComponent } from "./components/user_mgmt/profile/user_profile.component";


const routes: Routes = [
  { path: "search-professionals", component: ServiceListComponent },

  { path: "booking-form", component: BookingFormComponent, canActivate: [AuthGuard]},
  { path: "complete_user/:id", component: InfoComponent, canActivate: [AuthGuard]},
  { path: "reviews", component: ReseñasComponent,canActivate: [AuthGuard]},
  { path: "login", component: FormComponent },
  { path: "contracts", component: ContractsComponent, canActivate: [AuthGuard]},
  { path: "add-service", component: AddServiceComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: "", component: HomePageComponent },
  { path: "**", component: HomePageComponent }
  

  // otras rutas
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule, BrowserModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
