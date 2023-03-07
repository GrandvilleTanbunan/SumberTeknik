import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailtransaksitanggalPage } from './detailtransaksitanggal.page';

const routes: Routes = [
  {
    path: '',
    component: DetailtransaksitanggalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailtransaksitanggalPageRoutingModule {}
