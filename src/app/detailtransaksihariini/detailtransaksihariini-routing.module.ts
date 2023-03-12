import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailtransaksihariiniPage } from './detailtransaksihariini.page';

const routes: Routes = [
  {
    path: '',
    component: DetailtransaksihariiniPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailtransaksihariiniPageRoutingModule {}
