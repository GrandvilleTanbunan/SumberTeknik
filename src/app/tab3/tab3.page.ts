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
import { ModalController } from '@ionic/angular';
import { DetailtransaksitanggalPage } from '../detailtransaksitanggal/detailtransaksitanggal.page';


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
  constructor(private dataService: DataService, private db: AngularFirestore, private modalCtrl: ModalController) {
    this.barChart();
    // this.areaChart();
    this.bulanini = moment().format('MM/YYYY');
    this.tahunini = moment().format('YYYY');

    this.getTransaksi();
    moment.locale('id');
    // this.LineChart();


  }

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
        height: 200,
        width: '100%',
        stacked: true,
        toolbar: {
          show: true,
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

    if(this.selectedtimeline == "Bulan Ini")
    {
      this.barOptions = {
        chart: {
          type: 'bar',
          height: 200,
          width: '100%',
          stacked: true,
          toolbar: {
            show: true,
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

    if(this.selectedtimeline == "Tahun Ini")
    {
      this.barOptions = {
        chart: {
          type: 'bar',
          height: 200,
          width: '100%',
          stacked: true,
          toolbar: {
            show: true,
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

  areaChart() {
    this.areaOptions = {
      chart: {
        type: 'area',
        height: 180,
        sparkline: {
          enabled: true,
        },
      },
      series: [
        {
          name: 'Penjualan',
          data: [
            47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93,
            53, 61, 27, 54, 43, 19, 46,
          ],
        },
      ],
      labels: ["Tanggal 1",2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
      stroke: {
        width: 2,
        colors: ['#ffd3a5'],
      },
      fill: {
        colors: ['#ffd3a5'],
        gradient: {
          gradientToColors: ['#2b2d3e'],
          opacityTo: 0.2,
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
      colors: ['#DCE6EC'],
      title: {
        text: '$424,652',
        offsetX: 30,
        style: {
          fontSize: '24px',
          color: '#78909c',
        },
      },
      subtitle: {
        text: 'Sales',
        offsetX: 30,
        style: {
          fontSize: '14px',
          color: '#78909c',
        },
      },
    };
  }

  LineChart()
  {
    if(this.selectedtimeline == "Tahun Ini")
    {
      this.chartOptions = {
        series: [
          {
            name: "Penjualan",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
          }
        ],
        chart: {
          height: 275,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Penjualan Dalam Tahun Ini",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep"
          ],
          title:{
            text:"Tanggal"
          }
        }
      };
    }

    if(this.selectedtimeline == "Bulan Ini")
    {
      // this.getData("Bulan Ini")

      this.chartOptions = {
        series: [
          {
            name: "Penjualan",
            
            data: this.dataFinal
          }
        ],
        chart: {
          height: 275,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Penjualan Dalam Bulan Ini",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: [
            "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25",
            "26","27","28","29","30","31",
          ],
          title:{
            text:"Tanggal"
          }
        }
      

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
