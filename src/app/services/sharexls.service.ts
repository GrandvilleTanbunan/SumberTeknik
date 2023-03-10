import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
declare var window:any;
import write_blob from 'capacitor-blob-writer'
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SharexlsService {
  selectedtimeline :any;
  keteranganwaktu: any;
  transaksibulanini:any;
  constructor(private toastController: ToastController) { 
    moment().locale('id');
  }

  async createXLS()
  {
    this.selectedtimeline= window.tab3.selectedtimeline;
    this.transaksibulanini = window.tab3.transaksibulanini;
    if(this.transaksibulanini.length != 0)
    {
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
  
      console.log(window.tab3.transaksibulanini)
      const EXCEL_TYPE  = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(window.tab3.transaksibulanini);
  
      const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      const excelData: Blob = new Blob([excelBuffer], {
        type: EXCEL_TYPE
      });
  
      write_blob({
        path: `Laporan Dessertie ${this.keteranganwaktu + " " + moment().format('LTS')}.xlsx`,
        directory: Directory.Documents,
        blob: excelData
      }).then(async function(x){
        window.alert('Data saved to Documents');
      }).catch(function(e){
        window.alert(e);
      });
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
}
