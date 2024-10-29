import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AddResourceComponent } from "./components/add-resource/add-resource.component";
import { HttpClient } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, AddResourceComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClient, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
