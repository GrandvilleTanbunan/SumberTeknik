import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TambahkategoriPageRoutingModule } from './tambahkategori-routing.module';

import { TambahkategoriPage } from './tambahkategori.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TambahkategoriPageRoutingModule
  ],
  declarations: [TambahkategoriPage]
})
export class TambahkategoriPageModule {}
