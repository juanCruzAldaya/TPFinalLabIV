import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import {FormComponent} from './login/form/form.component'


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: FormComponent },

  // otras rutas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
