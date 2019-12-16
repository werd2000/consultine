import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MaterialModule } from '../material.module';
import { BtnVolverComponent } from './btn/btn-volver/btn-volver.component';
import { MapsComponent } from './maps/maps.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    // BreadcrumbsComponent,
    HeaderComponent,
    SidebarComponent,
    BtnVolverComponent,
    MapsComponent
  ],
  exports: [
    // BreadcrumbsComponent,
    HeaderComponent,
    SidebarComponent,
    BtnVolverComponent,
    MapsComponent
  ]
})
export class SharedModule { }
