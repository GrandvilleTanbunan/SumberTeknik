import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailtransaksihariiniPageRoutingModule } from './detailtransaksihariini-routing.module';

import { DetailtransaksihariiniPage } from './detailtransaksihariini.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailtransaksihariiniPageRoutingModule
  ],
  declarations: [DetailtransaksihariiniPage]
})
export class DetailtransaksihariiniPageModule {}
