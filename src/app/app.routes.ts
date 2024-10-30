import { Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import { FormComponent } from './login/form/form.component'

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: FormComponent },
]


export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: FormComponent },
];