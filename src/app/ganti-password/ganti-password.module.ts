import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GantiPasswordPageRoutingModule } from './ganti-password-routing.module';

import { GantiPasswordPage } from './ganti-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GantiPasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [GantiPasswordPage]
})
export class GantiPasswordPageModule {}
