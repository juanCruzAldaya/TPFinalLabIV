import { Routes } from "@angular/router";
import { HomePageComponent } from "./components/home/home-page/home-page.component";
import { InfoComponent } from "./components/complet_user/info.component";
import { FormComponent } from "./components/login/form/form.component";
const routes: Routes = [
  { path: "login", component: FormComponent },

  { path: "", component: HomePageComponent },
];

export const appRoutes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "login", component: FormComponent },
];
