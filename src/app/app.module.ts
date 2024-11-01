import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './login/form/form.component';
import { HomeModule } from './home/home.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from './app.routes';
import { InfoComponent } from './info/info.component';


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    InfoComponent,
    
   
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HomeModule,
    NgbModule,
    HttpClientModule

    
  ],
  exports:[
    RouterModule,
    FormComponent
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
