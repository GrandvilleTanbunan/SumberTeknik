import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CartService } from '../services/cart.service';
import { DataService } from '../services/data.service';
import {registerLocaleData, formatNumber} from '@angular/common';

import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
// import EscPosEncoder from 'esc-pos-encoder-ionic';
import EscPosEncoder from '@mineminemine/esc-pos-encoder-ionic';
declare var window:any;
// import { ThermalPrinterPlugin } from 'thermal-printer-cordova-plugin/src';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  invoicenumber :any;
  grandtotal: any;
  cart:any;
  kembalian = 0;
  jumlahbayar: any;
  totalamount = 0;
  MAC_ADDRESS: any;
  img : any;
  ThermalPrinterEncoder: any
  constructor(private bluetoothSerial: BluetoothSerial, private loadingCtrl: LoadingController,private alertCtrl: AlertController,private toastController: ToastController,private cartService:CartService,private dataService:DataService,private db: AngularFirestore, private modalCtrl: ModalController) { 
    let encoder = new EscPosEncoder();
    this.img = new Image();
    this.MAC_ADDRESS = "0F:02:18:71:89:08";
    let result = encoder
    .initialize()
    .text('The quick brown fox jumps over the lazy dog')
    .newline()
    .qrcode('https://nielsleenheer.com')
    .encode();


  }

  ngOnInit() {
    // console.log("ini di modal: " , this.invoicenumber)
    // console.log("ini di modal: " , this.grandtotal)
    // console.log("ini di modal: " , this.cart)
    moment.locale('id');

    this.hitungjumlahitem();

  }

  async checkout()
  {
    
    let alert = await this.alertCtrl.create({

      subHeader: 'Selesaikan transaksi?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'YA',
          handler: async () => {
            if(this.kembalian != 0 || this.grandtotal - this.jumlahbayar == 0)
            {
              const loading = await this.loadingCtrl.create({
                message: 'Mohon tunggu...',
              });
          
              loading.present().then(async () => {
                this.db.collection(`Transaksi`).doc(`${this.invoicenumber}`).set({
                  InvoiceID: this.invoicenumber,
                  tanggal: moment().format('DD/MM/YYYY'),
                  hari: moment().format('dddd'),
                  bulan: moment().format('MM'),
                  tahun: moment().format('yyyy'),
                  waktu: moment().format('LTS'),
                  timestamp: moment().format(),
                  grandtotal: this.grandtotal,
                  jumlahbayar: this.jumlahbayar,
                  jumlahitem:this.totalamount
                }).then(async () => {
                  for (let i = 0; i < this.cart.length; i++) {
                    this.db.collection(`Transaksi/${this.invoicenumber}/Item`).add(this.cart[i]);
                  }
                  // this.bluetoothSerial.write('hello world')
                  loading.dismiss();
                
                  this.cartService.clearCart();
                  this.dataService.getData();
                  window.tab1.loadData();
                  const toast = await this.toastController.create({
                    message: 'Checkout berhasil!',
                    duration: 700,
                    position: 'bottom'
                  });
                  await toast.present().then(()=>{
                    this.modalCtrl.dismiss();
                  });
                });
                
              });
            }
            else
            {
              const toast = await this.toastController.create({
                message: 'Masukkan jumlah pembayaran!',
                duration: 2000,
                position: 'bottom'
              });
              await toast.present();
            }
            
          }
        }
      ]
    });
    await alert.present();

  }

  listDevices(){
    console.log("LIST DEVICES");
    this.bluetoothSerial.list().then(function(devices) {
      devices.forEach(function(device: any) {
        console.log("Device id: ", device.id);
        console.log("Device name: ", device.name);
      })
    }).catch((e) =>{
      console.error(e);
    });
  }
  
  demoPrint(){
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();
    this.img = new Image();
    this.img.src = "../assets/LOGO DESSERTIE.png";

    function alignLeftRight(left:any, right:any) {
      let lineWidth = 29;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan) + "Rp "+ right;
    }

    function alightLeftRightItem(left:any, right:any){
      let lineWidth = 27;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan)+ right;
    }

    result
    
      .codepage('windows1250')
      .align('center')
      // .image(this.img, 240, 240, 'threshold')
      .line("DESSERTIE")
      .line("Jl. Jenderal Sudirman")
      .newline()
      .line("--------------------------------")
      .align('left')
      for(let i=0; i<this.cart.length; i++)
      {
        result
        .line(this.cart[i].amount + "x  " + this.cart[i].nama)
        // .line("    @"+formatNumber(this.cart[i].harga, 'en-US')+"       " + formatNumber((this.cart[i].amount * this.cart[i].harga), 'en-US'))
        .line("    @"+ alightLeftRightItem(formatNumber(this.cart[i].harga, 'en-US'), formatNumber((this.cart[i].amount * this.cart[i].harga), 'en-US')))

      }
      result
      .newline()
      .line('Total Item: ' + this.totalamount)
      // .text('Total Belanja:        ')
      // .line("Rp " + formatNumber(this.grandtotal, 'en-US'))
      .text(alignLeftRight('Total Belanja', formatNumber(this.grandtotal, 'en-US')))
      .newline()
      .newline()
      .newline()
      .newline()
      .cut();

    const resultByte = result.encode();

    // send byte code into the printer
    this.bluetoothSerial.connect(this.MAC_ADDRESS).subscribe(() => {
      this.bluetoothSerial.write(resultByte)
        .then(() => {
          this.bluetoothSerial.clear();
          this.bluetoothSerial.disconnect();
          console.log('Print success');
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

 
  hitungjumlahitem()
  {
    console.log(this.cart)
    for(let i=0; i<this.cart.length; i++)
    {
      this.totalamount = this.totalamount + this.cart[i].amount;
    }
  }

  HitungKembalian()
  {
    // this.kembalian = 0;
    if(this.jumlahbayar > this.grandtotal)
    {
      this.kembalian = this.jumlahbayar - this.grandtotal;
    }
    else
    {
      this.kembalian = 0;
    }

  }

  close()
  {
    this.modalCtrl.dismiss();
  }

}
