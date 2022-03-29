import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { StoredetailsComponent } from './storedetails/storedetails.component';
import { StoresComponent } from './stores/stores.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    StoreComponent,
    StoredetailsComponent,
    StoresComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    NgbModule,
    FormsModule,
    SharedModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class StoreModule { }
