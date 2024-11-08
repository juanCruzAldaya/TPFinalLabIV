import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { AddServiceComponent } from "./components/add-resource/add-service.component";

export const appRoutes: Routes = [
  { path: "addResource", component: AddServiceComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    CommonModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
