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
  tmptanggal : any[] = [];
  tanggalkembar = true;

  constructor(private dataService: DataService, private db: AngularFirestore) {
    this.barChart();
    // this.areaChart();
    this.bulanini = moment().format('MM/YYYY');
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
        height: 275,
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
        text: 'Penjualan Dalam Sebulan',
        align: 'left',
        style: {
          fontSize: '16px',
          color: '#78909c',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        labels: {
          colors: '#78909c',
        },
      },
    };
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

  getData() {
    this.dataFinal = [];
    this.tmptanggal = [];
    let tmpcountitem = 0;;
    console.log(this.selectedtimeline)
    if (this.selectedtimeline == "Bulan Ini") {
      this.tmptanggal = [];
      for (let i = 0; i < this.transaksi.length; i++) {
        this.tanggalkembar = false;
        if (moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('MM/YYYY') == this.bulanini) {
          //for tmp tanggalnya supaya ada pengecekan tanggal kembar
          if (this.tmptanggal.length == 0) {
            tmpcountitem = this.transaksi[i].jumlahitem;
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
              tmpcountitem = 0;
              tmpcountitem = tmpcountitem + this.transaksi[i].jumlahitem;
              this.tmptanggal.push(moment(this.transaksi[i].tanggal, "DD/MM/YYYY").format('DD/MM/YYYY'))
              this.tanggalkembar = true;
            }
            else {
              tmpcountitem = tmpcountitem + this.transaksi[i].jumlahitem;
            }
            if (i == (this.transaksi.length - 1)) {
              this.dataFinal.push(tmpcountitem);
            }
          }
        }
      }
      console.log(this.dataFinal)
      console.log("tanggal: " + this.tmptanggal)
      //seletah ini jumlahkan jumlah itemnya bisa tanggal sama

    }
    this.barChart();
  }

}
