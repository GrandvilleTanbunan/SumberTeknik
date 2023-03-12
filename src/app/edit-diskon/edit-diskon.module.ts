import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDiskonPageRoutingModule } from './edit-diskon-routing.module';

import { EditDiskonPage } from './edit-diskon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDiskonPageRoutingModule
  ],
  declarations: [EditDiskonPage]
})
export class EditDiskonPageModule {}
