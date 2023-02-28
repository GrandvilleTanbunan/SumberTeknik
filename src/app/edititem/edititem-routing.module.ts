import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EdititemPage } from './edititem.page';

const routes: Routes = [
  {
    path: '',
    component: EdititemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EdititemPageRoutingModule {}
