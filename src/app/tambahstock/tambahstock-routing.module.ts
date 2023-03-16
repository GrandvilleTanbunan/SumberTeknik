import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahstockPage } from './tambahstock.page';

const routes: Routes = [
  {
    path: '',
    component: TambahstockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahstockPageRoutingModule {}
