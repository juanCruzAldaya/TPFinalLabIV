import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FormComponent } from './login/form/form.component';
import { FormInfoComponent } from './login/form-info/form-info.component';
@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    FormInfoComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
