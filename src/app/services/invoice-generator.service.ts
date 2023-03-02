import { Injectable } from '@angular/core';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class InvoiceGeneratorService {
  finalinvoice : any;

  constructor() {
    moment.locale('id');
   }

  generateinvoice()
  {
    const today = moment().format('DDMMYY');
    const waktu = moment().format('LTSMS');
    this.finalinvoice =  today + "." + waktu;
    return this.finalinvoice;
  }
}
