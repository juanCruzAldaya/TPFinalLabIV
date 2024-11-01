import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../home/header/header.component';
import { CarouselComponent } from '../home/carousel/carousel.component';
import { FeedbackComponent } from '../home/feedback/feedback.component';
import { FooterComponent } from '../home/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { SidebarComponent } from '../home/sidebar/sidebar.component';
import {FormsModule}  from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent,
    CarouselComponent,
    FeedbackComponent,
    FooterComponent,
    SidebarComponent

  ],

  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule,


  ],
  exports: [
    HeaderComponent,
    CarouselComponent,
    FeedbackComponent,
    FooterComponent,
    SidebarComponent

    
    
  ],
  providers: [ServiceService],
  
})
export class SharedModule { }
