import { Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import { FormComponent } from './login/form/form.component'
import { InfoComponent } from './complet_user/info.component';
const routes: Routes = [
  
  { path: 'login', component: FormComponent },
  
  { path: '', component: HomePageComponent }

]


export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: FormComponent },
];