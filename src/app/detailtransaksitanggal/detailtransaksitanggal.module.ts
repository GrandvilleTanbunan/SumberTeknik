import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailtransaksitanggalPageRoutingModule } from './detailtransaksitanggal-routing.module';

import { DetailtransaksitanggalPage } from './detailtransaksitanggal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailtransaksitanggalPageRoutingModule
  ],
  declarations: [DetailtransaksitanggalPage]
})
export class DetailtransaksitanggalPageModule {}
