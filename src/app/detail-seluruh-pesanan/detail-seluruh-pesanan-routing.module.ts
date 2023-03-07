import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailSeluruhPesananPage } from './detail-seluruh-pesanan.page';

const routes: Routes = [
  {
    path: '',
    component: DetailSeluruhPesananPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailSeluruhPesananPageRoutingModule {}
