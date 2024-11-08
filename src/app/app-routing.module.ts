import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import {FormComponent} from './login/form/form.component'
import { ServiceListComponent } from './filter-services/service-list/service-list.component';
import { BookingFormComponent } from './filter-services/booking-form/booking-form.component'
import { InfoComponent } from './complet_user/info.component';

const routes: Routes = [
  { path: 'search-professionals', component: ServiceListComponent },
  { path: '', component: HomePageComponent },
  { path: 'booking-form', component: BookingFormComponent },
  { path: 'complete_user/:id', component: InfoComponent},
  { path: 'login', component: FormComponent },
  { path: '**', component: HomePageComponent },
  

  // otras rutas
];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
