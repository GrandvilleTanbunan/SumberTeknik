import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TambahkategoriPage } from './tambahkategori.page';

const routes: Routes = [
  {
    path: '',
    component: TambahkategoriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TambahkategoriPageRoutingModule {}
