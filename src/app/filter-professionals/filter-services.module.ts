import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule if needed
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from './side-bar/side-bar.component';
import { ProfessionalListComponent } from './professional-list/professional-list.component';

@NgModule({
  declarations: [
    SidebarComponent,
    ProfessionalListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule here
    SharedModule
  ],
  exports: [
    SidebarComponent,
    ProfessionalListComponent,
  ]
})
export class FilterServiceModule { }
