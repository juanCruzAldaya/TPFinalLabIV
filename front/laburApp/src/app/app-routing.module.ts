import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AddResourceComponent } from "./components/add-resource/add-resource.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";

export const appRoutes: Routes = [
  { path: "addResource", component: AddResourceComponent },
  { path: "**", component: PageNotFoundComponent },
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
