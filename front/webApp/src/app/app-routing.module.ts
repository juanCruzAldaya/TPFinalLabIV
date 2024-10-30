import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './login/form/form.component';
import { FormInfoComponent } from './login/form-info/form-info.component';

const routes: Routes = [

  {path: "login", component: FormComponent},
  {path: "info/:id", component: FormInfoComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
