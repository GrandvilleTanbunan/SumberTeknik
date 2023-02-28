import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { EdititemPageRoutingModule } from './edititem-routing.module';

import { EdititemPage } from './edititem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EdititemPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [EdititemPage]
})
export class EdititemPageModule {}
