import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule if needed
import { SharedModule } from '../shared/shared.module';
import { FilterSidebarComponent } from './filter-sidebar/filter-sidebar.component';
import { ServiceListComponent } from './service-list/service-list.component';

@NgModule({
  declarations: [
    FilterSidebarComponent,
    ServiceListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule here
    SharedModule
  ],
  exports: [
    FilterSidebarComponent,
    ServiceListComponent,
  ]
})
export class FilterServiceModule { }
