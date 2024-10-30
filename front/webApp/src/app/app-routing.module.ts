import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './login/form/form.component';
import { FormRegisterComponent } from './login/form/form-register/form-register.component';

const routes: Routes = [

  {path: "login", component: FormComponent},
  {path: "lñsakdlñksalñdkñlaskdkñla", component: FormRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
