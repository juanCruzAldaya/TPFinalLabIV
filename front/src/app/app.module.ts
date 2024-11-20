import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HomeModule } from "./components/home/home.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "./shared/shared.module";
import { FilterServiceModule } from "./components/filter-services/filter-services.module";
import { InfoComponent } from "./components/user_mgmt/complete_user/info.component";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReseñasComponent } from "./components/resenia/resenia.component";
import { FormsModule } from '@angular/forms';
import { ContractsComponent } from './components/contracts/contracts.component'; // Import FormsModule if needed
import {ProfileComponent} from "./components/user_mgmt/profile/user_profile.component";


@NgModule({
  declarations: [AppComponent, InfoComponent, InfoComponent, ReseñasComponent, ContractsComponent, ProfileComponent],

  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    // RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
    }), // ToastrModule added
    ReactiveFormsModule,
    HomeModule,
    NgbModule,
    SharedModule,
    HttpClientModule,
    FilterServiceModule,
    BrowserAnimationsModule,
    
  ],
  exports: [RouterModule, InfoComponent],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
