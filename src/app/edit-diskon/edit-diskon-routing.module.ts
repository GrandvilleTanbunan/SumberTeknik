import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDiskonPage } from './edit-diskon.page';

const routes: Routes = [
  {
    path: '',
    component: EditDiskonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDiskonPageRoutingModule {}
