import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GantiPrinterPageRoutingModule } from './ganti-printer-routing.module';

import { GantiPrinterPage } from './ganti-printer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GantiPrinterPageRoutingModule
  ],
  declarations: [GantiPrinterPage]
})
export class GantiPrinterPageModule {}
