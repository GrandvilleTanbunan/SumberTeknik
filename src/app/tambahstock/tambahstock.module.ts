import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahstockPageRoutingModule } from './tambahstock-routing.module';

import { TambahstockPage } from './tambahstock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahstockPageRoutingModule
  ],
  declarations: [TambahstockPage]
})
export class TambahstockPageModule {}
