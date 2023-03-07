import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailSeluruhPesananPageRoutingModule } from './detail-seluruh-pesanan-routing.module';

import { DetailSeluruhPesananPage } from './detail-seluruh-pesanan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailSeluruhPesananPageRoutingModule
  ],
  declarations: [DetailSeluruhPesananPage]
})
export class DetailSeluruhPesananPageModule {}
