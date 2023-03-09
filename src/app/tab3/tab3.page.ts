import { Component } from '@angular/core';
import { ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,} from 'ng-apexcharts';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { ModalController, Platform } from '@ionic/angular';
import { DetailtransaksitanggalPage } from '../detailtransaksitanggal/detailtransaksitanggal.page';
import {PDFGenerator, PDFGeneratorOptions} from '@ionic-native/pdf-generator/ngx';
import { HttpClient } from '@angular/common/http';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {Plugins} from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo,} from '@capacitor/camera';
import { Margins } from 'pdfmake/interfaces';
import {registerLocaleData} from '@angular/common';
import {Pipe, PipeTransform} from '@angular/core';
import * as XLSX from 'xlsx';
// import { SocialSharing } from '@ionic-native/social-sharing';
// import { File } from '@ionic-native/file/ngx';
import { Share } from '@capacitor/share';
// const {Share} = Plugins;


// import { Filesystem, Directory } from '@capacitor/filesystem';
import { Filesystem, Directory, Encoding, FilesystemDirectory } from '@capacitor/filesystem';
// import { Preferences } from '@capacitor/preferences';

// const {Camera, Filesystem} = Plugins;

// import * as pdfMake from "pdfmake/build/pdfmake";
const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { async } from '@firebase/util';
import { GeneratePDFService } from '../generate-pdf.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
// import { CurrencyPipe } from '@angular/common';
declare var window:any;

export type ChartOptions = {
  chart: ApexChart;
  series: ApexAxisChartSeries | any[];
  stroke: ApexStroke;
  markers: ApexMarkers;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  colors: any[];
  labels: any[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
}


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})



export class Tab3Page {
  public options!: Partial<ChartOptions> | any;
  public barOptions: Partial<ChartOptions> | any;
  public areaOptions: Partial<ChartOptions> | any;
  public chartOptions: Partial<ChartOptions> | any;
  logoData: any = null;
  pdfobj : any = null;
  base64Image: any = null;
  photoPreview: any = null;

  selectedtimeline : any;
  transaksi: any[] = [];
  dataFinal: any[] = [];
  bulanini : any;
  tahunini : any;
  tmptanggal : any[] = [];
  tmpbulan: any[]= [];
  transaksibulanini : any[] = [];
  tanggalkembar = true;
  bulankembar = true;
  totalpendapatan: any = 0;
  grandtotal : any[] = [];
  tmpselectedMonth: any;
  tmpselectedYear: any;
  constructor(private generatePDF:GeneratePDFService,private plt: Platform,private http: HttpClient,private fileOpener:FileOpener,private dataService: DataService, private db: AngularFirestore, private modalCtrl: ModalController, private pdf: PDFGenerator) {
    this.barChart();
    // this.areaChart();
    this.bulanini = moment().format('MM/YYYY');
    this.tahunini = moment().format('YYYY');

    this.getTransaksi();
    moment.locale('id');
    // this.LineChart();
    window.tab3 = this;


  }

  ngOnInit()
  {
    this.loadLocalAssetToBase64();
    registerLocaleData('es');
  }

  loadLocalAssetToBase64(){
    this.http.get('./assets/LOGO DESSERTIE.png', {responseType:'blob'})
    .subscribe((res: any) => {
      const reader = new FileReader();
      reader.onloadend=() =>{
        this.logoData = reader.result;
      }
      reader.readAsDataURL(res);
    })
  }

  async takePicture(){
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    console.log('image');
    this.photoPreview = `data:image/jpeg;base64, ${image.base64String}`;
  }
  createPdf()
  {
    this.generatePDF.createPdf();
  }

  downloadPdf()
  {
    this.generatePDF.downloadPdf();
  }

  // exporttoexcel()
  // {
  //   let sheet = XLSX.utils.json_to_sheet(this.transaksibulanini);

  //     let book = {
  //       SheetNames: ["export"],
  //       Sheets: {
  //           "export": sheet
  //       }
  //     };

  //     let wbout = XLSX.write(book, {
  //       bookType: 'xlsx',
  //       bookSST: false,
  //       type: 'binary'
  //     });

  //     function s2ab(s:any) {
  //       let buf = new ArrayBuffer(s.length);
  //       let view = new Uint8Array(buf);
  //       for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  //       return buf;
  //     }

  //     let blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const result = reader.result as string;
  //       const base64Data = result.split(',')[1];

        
  //     }
  //     // this.file.writeFile(this.file.dataDirectory, "ABC.xlsx", blob, {replace: true}).then(async res =>{
  //         // this.socialSharing.share("abc", "abc", res.nativeURL, "abc");
  //         // await Share.share({
  //         //   title:"XLS",
  //         //   text:'Belajar XLS',
  //         //   url: res.nativeURL
  //         // })
  //       // });
  // }


  getTransaksi()
  {
    this.db.collection(`Transaksi`)
    .valueChanges({idField: 'TransaksiID'})
    .subscribe((data:any) => {
        this.transaksi = data;
        console.log(this.transaksi)
        // this.LineChart();

    });
  }

  barChart() {
    this.barOptions = {
      chart: {
        type: 'bar',
        height: 170,
        width: '100%',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      series: [
        {
          name: 'Penjualan',
          // data: [42, 52, 16, 55, 59, 51, 45, 32, 26, 33, 44, 51,42, 52, 16, 55, 59, 51, 45, 32, 26, 33, 44, 51,45, 32, 26, 33, 44, 51],
          data: this.dataFinal
        },
        // {
        //   name: 'Foods',
        //   data: [6, 12, 4, 7, 5, 3, 6, 4, 3, 3, 5, 6],
        // },
      ],
      labels: this.tmptanggal,
      grid: {
        borderColor: '#343E59',
        padding: {
          right: 0,
          left: 0,
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: '#78909c',
          },
        },
      },
      title: {
        // text: 'Penjualan Dalam Sebulan',
        align: 'left',
        style: {
          fontSize: '16px',
          color: '#78909c',
        },
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        labels: {
          colors: '#00E396',
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          distributed: false,
        },
      },
      theme: {
        palette: 'palette9'
      },
      colors:['#8D5B4C', '#E91E63', '#9C27B0']
    };

    if(this.selectedtimeline == "Bulan Ini" || this.selectedtimeline == "Pilih Bulan")
    {
      this.barOptions = {
        chart: {
          type: 'bar',
          height: 170,
          width: '100%',
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        series: [
          {
            name: 'Penjualan',
            // data: [42, 52, 16, 55, 59, 51, 45, 32, 26, 33, 44, 51,42, 52, 16, 55, 59, 51, 45, 32, 26, 33, 44, 51,45, 32, 26, 33, 44, 51],
            data: this.dataFinal
          },
          // {
          //   name: 'Foods',
          //   data: [6, 12, 4, 7, 5, 3, 6, 4, 3, 3, 5, 6],
          // },
        ],
        labels: this.tmptanggal,
        grid: {
          borderColor: '#343E59',
          padding: {
            right: 0,
            left: 0,
          },
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              colors: '#78909c',
            },
          },
        },
        title: {
          text: 'Penjualan Dalam Bulan Ini',
          align: 'left',
          style: {
            fontSize: '16px',
            color: '#78909c',
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          labels: {
            colors: '#00E396',
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            distributed: false,
          },
        },
        theme: {
          palette: 'palette9'
        },
        colors:['#8D5B4C', '#E91E63', '#9C27B0']
      };
    }

    if(this.selectedtimeline == "Tahun Ini" || this.selectedtimeline == "Pilih Tahun")
    {
      this.barOptions = {
        chart: {
          type: 'bar',
          height: 170,
          width: '100%',
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        series: [
          {
            name: 'Penjualan',
            // data: [42, 52, 16, 55, 59, 51, 45, 32, 26, 33, 44, 51,42, 52, 16, 55, 59, 51, 45, 32, 26, 33, 44, 51,45, 32, 26, 33, 44, 51],
            data: this.dataFinal
          },
          // {
          //   name: 'Foods',
          //   data: [6, 12, 4, 7, 5, 3, 6, 4, 3, 3, 5, 6],
          // },
        ],
        labels: this.tmpbulan,
        grid: {
          borderColor: '#343E59',
          padding: {
            right: 0,
            left: 0,
          },
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              colors: '#78909c',
            },
          },
        },
        title: {
          text: 'Penjualan Dalam Tahun Ini',
          align: 'left',
          style: {
            fontSize: '16px',
            color: '#78909c',
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          labels: {
            colors: '#00E396',
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            distributed: false,
          },
        },
        theme: {
          palette: 'palette9'
        },
        colors:['#8D5B4C', '#E91E63', '#9C27B0']
      };
    }
    
  }


  getData(selectedtimeline: any) {
    this.selectedtimeline = selectedtimeline;
    this.dataFinal = [];
    this.tmptanggal = [];
    this.tmpbulan = [];
    let tmpcountitem = 0;
    let tmpcountgrandtotal = 0;
    this.transaksibulanini = [];
    this.totalpendapatan = 0;
    this.grandtotal = [];
    console.log(selectedtimeline)
    if (selectedtimeline == "Bulan Ini") {
      this.tmptanggal = [];
      for (let i = 0; i < this.transaksi.length; i++) {
        this.tanggalkembar = false;
        if (moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MM/YYYY') == this.bulanini) {
          //for tmp tanggalnya supaya ada pengecekan tanggal kembar
          if (this.tmptanggal.length == 0) {
            tmpcountitem = this.transaksi[i].jumlahitem;
            tmpcountgrandtotal = this.transaksi[i].grandtotal;
            this.tmptanggal.push(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY'))
          }
          else {
            for (let j = 0; j < this.tmptanggal.length; j++) {
              if (this.tmptanggal[j] == moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY')) {
                // console.log("masuk kembar tidak boleh isi")
                this.tanggalkembar = true;
              }
              else {
                this.tanggalkembar = false;
              }
            }
            if (this.tanggalkembar == false) {
              this.dataFinal.push(tmpcountitem);
              this.grandtotal.push(tmpcountgrandtotal)
              this.transaksibulanini.push({
                grandtotal: tmpcountgrandtotal,
                tanggal: moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY')
              });

              tmpcountitem = 0;
              tmpcountgrandtotal = 0;
              tmpcountitem = tmpcountitem + this.transaksi[i].jumlahitem;
              tmpcountgrandtotal = tmpcountgrandtotal + this.transaksi[i].grandtotal;
              this.tmptanggal.push(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY'))
              this.tanggalkembar = true;
            }
            else {
              tmpcountitem = tmpcountitem + this.transaksi[i].jumlahitem;
              tmpcountgrandtotal = tmpcountgrandtotal + this.transaksi[i].grandtotal;

            }
            
          }
        }
        //last item

        if (i == (this.transaksi.length - 1)) {
          this.dataFinal.push(tmpcountitem);
          this.grandtotal.push(tmpcountgrandtotal)

          this.transaksibulanini.push({
            grandtotal: tmpcountgrandtotal,
            tanggal: moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY')
          });
        }
      }
      console.log(this.dataFinal)
      console.log("tanggal: " + this.tmptanggal)

      for(let i=0; i<this.transaksibulanini.length; i++)
      {
        this.transaksibulanini[i].tanggal = this.tmptanggal[i];
        this.totalpendapatan = this.totalpendapatan + this.transaksibulanini[i].grandtotal;
      }

      this.transaksibulanini = this.transaksibulanini.reverse();

      console.log(this.transaksibulanini)
      console.log(this.grandtotal)


      //seletah ini jumlahkan jumlah itemnya bisa tanggal sama

    };

    if(selectedtimeline == "Tahun Ini")
    {
      this.tmpbulan = [];
      this.tmptanggal = [];

      for(let i=0; i<this.transaksi.length; i++)
      {
        this.bulankembar = false;
        if(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('YYYY') == this.tahunini)
        {
          if (this.tmpbulan.length == 0) {
            tmpcountitem = this.transaksi[i].jumlahitem;
            tmpcountgrandtotal = this.transaksi[i].grandtotal;
            this.tmpbulan.push(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MMMM YYYY'))
          }
          else {
            for (let j = 0; j < this.tmpbulan.length; j++) {
              if (this.tmpbulan[j] == moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MMMM YYYY')) {
                // console.log("masuk kembar tidak boleh isi")
                this.bulankembar = true;
              }
              else {
                this.bulankembar = false;
              }
            }
            if (this.bulankembar == false) {
              this.dataFinal.push(tmpcountitem);
              this.grandtotal.push(tmpcountgrandtotal)
              this.transaksibulanini.push({
                grandtotal: tmpcountgrandtotal,
                tanggal: moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MMMM YYYY')
              });

              tmpcountitem = 0;
              tmpcountgrandtotal = 0;
              tmpcountitem = tmpcountitem + this.transaksi[i].jumlahitem;
              tmpcountgrandtotal = tmpcountgrandtotal + this.transaksi[i].grandtotal;
              this.tmpbulan.push(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MMMM YYYY'))
              this.bulankembar = true;
            }
            else {
              tmpcountitem = tmpcountitem + this.transaksi[i].jumlahitem;
              tmpcountgrandtotal = tmpcountgrandtotal + this.transaksi[i].grandtotal;

            }
            
          }
        }
        //last item
        if (i == (this.transaksi.length - 1)) {
          this.dataFinal.push(tmpcountitem);
          this.grandtotal.push(tmpcountgrandtotal)

          this.transaksibulanini.push({
            grandtotal: tmpcountgrandtotal,
            tanggal: moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MMMM YYYY')
          });
        }
      }

      for(let i=0; i<this.transaksibulanini.length; i++)
      {
        this.transaksibulanini[i].tanggal = this.tmpbulan[i];
        this.totalpendapatan = this.totalpendapatan + this.transaksibulanini[i].grandtotal;
      }

      this.transaksibulanini = this.transaksibulanini.reverse();

    }

    if(selectedtimeline == "Pilih Bulan"){
      console.log(this.tmpselectedMonth);
      const formateddate = moment(this.tmpselectedMonth).format('MM/YYYY')
      console.log(formateddate);

      this.tmptanggal = [];
      for (let i = 0; i < this.transaksi.length; i++) {
        this.tanggalkembar = false;
        if (moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MM/YYYY') == formateddate) {
          //for tmp tanggalnya supaya ada pengecekan tanggal kembar
          if (this.tmptanggal.length == 0) {
            tmpcountitem = this.transaksi[i].jumlahitem;
            tmpcountgrandtotal = this.transaksi[i].grandtotal;
            this.tmptanggal.push(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY'))
          }
          else {
            for (let j = 0; j < this.tmptanggal.length; j++) {
              if (this.tmptanggal[j] == moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY')) {
                // console.log("masuk kembar tidak boleh isi")
                this.tanggalkembar = true;
              }
              else {
                this.tanggalkembar = false;
              }
            }
            if (this.tanggalkembar == false) {
              this.dataFinal.push(tmpcountitem);
              this.grandtotal.push(tmpcountgrandtotal)
              this.transaksibulanini.push({
                grandtotal: tmpcountgrandtotal,
                tanggal: moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY')
              });

              tmpcountitem = 0;
              tmpcountgrandtotal = 0;
              tmpcountitem = tmpcountitem + this.transaksi[i].jumlahitem;
              tmpcountgrandtotal = tmpcountgrandtotal + this.transaksi[i].grandtotal;
              this.tmptanggal.push(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY'))
              this.tanggalkembar = true;
            }
            else {
              tmpcountitem = tmpcountitem + this.transaksi[i].jumlahitem;
              tmpcountgrandtotal = tmpcountgrandtotal + this.transaksi[i].grandtotal;

            }
            
          }
        }
        //last item

        if (i == (this.transaksi.length - 1)) {
          this.dataFinal.push(tmpcountitem);
          this.grandtotal.push(tmpcountgrandtotal)

          this.transaksibulanini.push({
            grandtotal: tmpcountgrandtotal,
            tanggal: moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY')
          });
        }
      }
      console.log(this.dataFinal)
      console.log("tanggal: " + this.tmptanggal)

      for(let i=0; i<this.transaksibulanini.length; i++)
      {
        this.transaksibulanini[i].tanggal = this.tmptanggal[i];
        this.totalpendapatan = this.totalpendapatan + this.transaksibulanini[i].grandtotal;
      }

      this.transaksibulanini = this.transaksibulanini.reverse();

      console.log(this.transaksibulanini)
      console.log(this.grandtotal)

    }

    if(selectedtimeline == "Pilih Tahun")
    {
      this.tmpbulan = [];
      this.tmptanggal = [];
      console.log(this.tmpselectedYear)
      const formateddate = moment(this.tmpselectedYear).format('YYYY')
      console.log(formateddate);

      for(let i=0; i<this.transaksi.length; i++)
      {
        this.bulankembar = false;
        if(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('YYYY') == formateddate)
        {
          if (this.tmpbulan.length == 0) {
            tmpcountitem = this.transaksi[i].jumlahitem;
            tmpcountgrandtotal = this.transaksi[i].grandtotal;
            this.tmpbulan.push(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MMMM YYYY'))
          }
          else {
            for (let j = 0; j < this.tmpbulan.length; j++) {
              if (this.tmpbulan[j] == moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MMMM YYYY')) {
                // console.log("masuk kembar tidak boleh isi")
                this.bulankembar = true;
              }
              else {
                this.bulankembar = false;
              }
            }
            if (this.bulankembar == false) {
              this.dataFinal.push(tmpcountitem);
              this.grandtotal.push(tmpcountgrandtotal)
              this.transaksibulanini.push({
                grandtotal: tmpcountgrandtotal,
                tanggal: moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MMMM YYYY')
              });

              tmpcountitem = 0;
              tmpcountgrandtotal = 0;
              tmpcountitem = tmpcountitem + this.transaksi[i].jumlahitem;
              tmpcountgrandtotal = tmpcountgrandtotal + this.transaksi[i].grandtotal;
              this.tmpbulan.push(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MMMM YYYY'))
              this.bulankembar = true;
            }
            else {
              tmpcountitem = tmpcountitem + this.transaksi[i].jumlahitem;
              tmpcountgrandtotal = tmpcountgrandtotal + this.transaksi[i].grandtotal;

            }
            
          }
        }
        //last item
        if (i == (this.transaksi.length - 1)) {
          this.dataFinal.push(tmpcountitem);
          this.grandtotal.push(tmpcountgrandtotal)

          this.transaksibulanini.push({
            grandtotal: tmpcountgrandtotal,
            tanggal: moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MMMM YYYY')
          });
        }
      }

      for(let i=0; i<this.transaksibulanini.length; i++)
      {
        this.transaksibulanini[i].tanggal = this.tmpbulan[i];
        this.totalpendapatan = this.totalpendapatan + this.transaksibulanini[i].grandtotal;
      }

      this.transaksibulanini = this.transaksibulanini.reverse();

    }
    this.barChart();
  }

  async pilihtransaksi(item: any)
  {
    let modal = await this.modalCtrl.create({
      component: DetailtransaksitanggalPage,
      componentProps: {
        item: item,
        selectedtimeline: this.selectedtimeline
      },
      cssClass: 'cart-modal'
    });
    modal.present();
  }

}
