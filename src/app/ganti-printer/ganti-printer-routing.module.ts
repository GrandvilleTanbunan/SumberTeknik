import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GantiPrinterPage } from './ganti-printer.page';

const routes: Routes = [
  {
    path: '',
    component: GantiPrinterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GantiPrinterPageRoutingModule {}
