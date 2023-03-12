import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPPNPageRoutingModule } from './edit-ppn-routing.module';

import { EditPPNPage } from './edit-ppn.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPPNPageRoutingModule
  ],
  declarations: [EditPPNPage]
})
export class EditPPNPageModule {}
