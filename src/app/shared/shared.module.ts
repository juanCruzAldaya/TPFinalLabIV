import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { CarouselComponent } from './carousel/carousel.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProfessionalListComponent } from './professional-list/professional-list.component';
import {FormsModule}  from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent,
    CarouselComponent,
    FeedbackComponent,
    FooterComponent,
    SidebarComponent,
    ProfessionalListComponent,
    
    
    

  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule

  ],
  exports: [
    HeaderComponent,
    CarouselComponent,
    FeedbackComponent,
    FooterComponent,
    SidebarComponent,
    ProfessionalListComponent,

    
    
  ],
  providers: [ServiceService],
  
})
export class SharedModule { }
