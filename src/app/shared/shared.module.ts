import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { CarouselComponent } from './carousel/carousel.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ServiceService } from '../services/service.service';

@NgModule({
  declarations: [
    HeaderComponent,
    CarouselComponent,
    FeedbackComponent,
    FooterComponent,
    
    
    

  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,

    
   
    
    
  ],
  exports: [
    HeaderComponent,
    CarouselComponent,
    FeedbackComponent,
    FooterComponent
    
    
  ],
  providers: [ServiceService],
  
})
export class SharedModule { }
