import { Injectable } from '@angular/core';
import { Margins } from 'pdfmake/interfaces';
import {PDFGenerator, PDFGeneratorOptions} from '@ionic-native/pdf-generator/ngx';
import { HttpClient } from '@angular/common/http';
import { FileOpener } from '@ionic-native/file-opener/ngx';
const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { async } from '@firebase/util';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { Filesystem, Directory, Encoding, FilesystemDirectory } from '@capacitor/filesystem';
import { ModalController, Platform, ToastController } from '@ionic/angular';
declare var window:any;
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class GeneratePDFService {
  pdfobj : any = null;
  selectedtimeline :any;
  transaksibulanini:any;
  keteranganwaktu: any;
  constructor(private toastController:ToastController,private plt: Platform,private http: HttpClient,private fileOpener:FileOpener) {
    moment().locale('id');
   }

  async createPdf()
  {
    this.transaksibulanini= window.tab3.transaksibulanini;
    this.selectedtimeline= window.tab3.selectedtimeline;
    if(this.selectedtimeline == "Bulan Ini")
    {
      this.keteranganwaktu = moment().format('MMMM YYYY');
      console.log(this.keteranganwaktu);
    }
    else if(this.selectedtimeline == "Tahun Ini")
    {
      this.keteranganwaktu = "Tahun "+  moment().format('yyyy');
      console.log(this.keteranganwaktu);
    }

    else if(this.selectedtimeline == "Pilih Bulan")
    {
      const formateddate = moment(window.tab3.tmpselectedMonth).format('MMMM yyyy')
      this.keteranganwaktu = formateddate;
      console.log(this.keteranganwaktu);
    }
    else if(this.selectedtimeline == "Pilih Tahun")
    {
      const formateddate = "Tahun "+ moment(window.tab3.tmpselectedYear).format('yyyy')
      this.keteranganwaktu = formateddate;
      console.log(this.keteranganwaktu);
    }

    console.log(this.transaksibulanini)
    if(this.transaksibulanini.length != 0)
    {
      const docDefinition = {
        // watermark: { text: 'DESSERTEA', color: 'black', opacity: 0.2, bold: true },
        content: [
          { text: `Laporan Keuangan Dessertie ${this.keteranganwaktu}`, style: 'header', alignment: 'center' },
          // 'You can declare how many rows should be treated as a header. Headers are automatically repeated on the following pages',

          {
            style: 'tableExample',
            table: {
              headerRows: 1,
              widths: ['*', '*'],
              body: [
                [{ text: 'Tanggal/Bulan', alignment: 'center',style:'boldandbig' }, { text: 'Total (IDR)', alignment: 'center',style:'boldandbig' }],
                ...this.transaksibulanini.map((p: any) => ([{text: p.tanggal,alignment:'center'}, {text: p.grandtotal, alignment:'center'}])),
                [{text: 'Grand Total', alignment:'center', style:'boldandbig'}, {text: 'Rp ' +  window.tab3.totalpendapatan,alignment:'center',style:'boldandbig'}],
              ]
            }
          },

        ],
        styles: {
          boldandbig:{
            bold:true,
            fontSize: 18
          },
          header: {
            fontSize: 23,
            bold: true,
            margin: [0, 0, 0, 10]as Margins,
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]as Margins,
          },
          tableExample: {
            margin: [0, 5, 0, 15]as Margins,
            fontSize:16
          },
          tableHeader: {
            bold: true,
            fontSize: 18,
            color: 'black',
            alignment: 'center'
          }
        }
        
      }
      this.pdfobj = pdfMake.createPdf(docDefinition);
      console.log(this.pdfobj)
    }
    else{
      const toast = await this.toastController.create({
        message: 'Pilih data terlebih dahulu!',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }
    

  }

  downloadPdf()
  {
    this.selectedtimeline= window.tab3.selectedtimeline;

    if(this.plt.is('cordova'))
    {
      this.pdfobj.getBase64(async(data:any)=>{
        try{
          let path = `pdf/Laporan Keuangan_${this.keteranganwaktu}.pdf`;
          const result = await Filesystem.writeFile({
            path,
            data,
            directory: FilesystemDirectory.Documents,
            recursive: true
          });
          this.fileOpener.open(`${result.uri}`,'application/pdf');
        }
        catch(e){
          console.error('Unable to write file', e);
        }
      });
    }
    else{
      this.pdfobj.download(); 
    }
  }
}
