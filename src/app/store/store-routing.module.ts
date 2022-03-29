import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store.component';
import { StoredetailsComponent } from './storedetails/storedetails.component';
import { StoresComponent } from './stores/stores.component';

const routes: Routes = [
  {
    path: '',
    component: StoreComponent,
    children: [
      {
        path: '',
        component: StoresComponent,
        data: {
          title: 'Store List',
        },
      },
      {
        path: 'details/:storeId',
        component: StoredetailsComponent,
        data: {
          title: 'Store Page',
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
