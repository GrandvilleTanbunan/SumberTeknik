import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CartService } from '../services/cart.service';
import { DataService } from '../services/data.service';
import {registerLocaleData, formatNumber} from '@angular/common';
import { collection, orderBy, where} from '@firebase/firestore';

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
  grandtotalkonstan: any;
  cart:any;
  kembalian = 0;
  jumlahbayar: any;
  totalamount = 0;
  MAC_ADDRESS: any;
  img : any;
  pakaiPPN = false;
  pakaiDisc = false;
  ThermalPrinterEncoder: any;
  PPN:any;
  diskon: any;
  grandtotaldiskon:any;
  grandtotalPPN:any;
  jumlahppn = 0;
  jumlahdisc = 0;
  deviceList: any;
  apakahbluetoothnyala : any;
  bluetoothconnected = false;
  constructor(private bluetoothSerial: BluetoothSerial, private loadingCtrl: LoadingController,private alertCtrl: AlertController,private toastController: ToastController,private cartService:CartService,private dataService:DataService,private db: AngularFirestore, private modalCtrl: ModalController) { 
    let encoder = new EscPosEncoder();
    this.img = new Image();
    let result = encoder
    .initialize()
    .text('The quick brown fox jumps over the lazy dog')
    .newline()
    .qrcode('https://nielsleenheer.com')
    .encode();
    this.getMAC();

    this.getPPN();
    this.getDisc();
  }

  ngOnInit() {
    console.log("ini di modal: " , this.invoicenumber)
    this.grandtotalkonstan = this.grandtotal;
    // console.log("ini di modal: " , this.grandtotal)
    // console.log("ini di modal: " , this.cart)
    moment.locale('id');
    this.getMAC();

    // this.connectBluetooth();

    this.hitungjumlahitem();

  }

  getMAC()
  {
    this.db.collection(`MACPrinter`)
        .valueChanges()
        .subscribe((data:any) => {
            this.MAC_ADDRESS = data[0].MAC;
            console.log('MAC: '+this.MAC_ADDRESS)
            this.connectBluetooth();
        }
        
    );
  }

  async connectBluetooth()
  {
    console.log(this.MAC_ADDRESS);
    
    this.bluetoothSerial.connect(this.MAC_ADDRESS).subscribe(async (success: any) => {
      const toast = await this.toastController.create({
        message: 'Printer Connected!',
        duration: 1000,
        position: 'top'
      });
      await toast.present()
      this.bluetoothconnected = true;

    },(error:any) => {
        console.log("Connection Error " +  error);
        this.bluetoothconnected = false;

      });

  }

  


  
  getDisc()
  {
    
    this.db.collection(`Diskon`)
        .valueChanges()
        .subscribe((data:any) => {
            this.diskon = data[0].diskon;
            console.log('Diskon: '+this.diskon)
            // return of(this.tmptype);
        }
        
    );
  }

  getPPN()
  {
    
    this.db.collection(`PPN`)
        .valueChanges()
        .subscribe((data:any) => {
            this.PPN = data[0].PPN;
            console.log('PPN: '+this.PPN)
            // return of(this.tmptype);
        }
        
    );
  }

  async checkout()
  {
    this.jumlahppn = 0;
    this.jumlahdisc = 0;
    let isEnabled : any;
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
            // this.selesaikantransaksi();

            this.checkbluetoothenabled();
            
          }
        }
      ]
    });
    await alert.present();

  }

  checkbluetoothenabled()
  {
    this.bluetoothSerial.isEnabled().then(data => {
      if(data){
        this.apakahbluetoothnyala = true;
        this.bluetoothSerial.list().then(async allDevices=> {
          // set the list to returned value
          if(allDevices.length > 0){
            this.deviceList=allDevices;
            console.log(this.deviceList)
            this.selesaikantransaksi();
          }else{
            let alert = await this.alertCtrl.create({
              header: 'Bluetooth',
              subHeader: 'Perangkat tidak ditemukan!',
              buttons: ['Dismiss']
            });
            await alert.present();
          }
        });
      }
    }).catch(async err=>{
      let alert = await this.alertCtrl.create({
        header: 'Bluetooth',
        subHeader: 'Periksa koneksi bluetooth!',
        buttons: ['Dismiss']
      });
      await alert.present();
      this.apakahbluetoothnyala = false;
      
    });
  }

  async selesaikantransaksi()
  {
    if(this.pakaiPPN == true)
    {
      this.jumlahppn = ((this.grandtotalkonstan * this.PPN)/100)
    }
    if(this.pakaiDisc == true)
    {
      this.jumlahdisc = ((this.grandtotalkonstan * this.diskon)/100)
    }
    if(this.kembalian != 0 || this.jumlahbayar >= this.grandtotal)
    {
      for(let i=0; i<2; i++)
      {
        this.printNota();
      }


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
          grandtotal: this.grandtotalkonstan,
          totalbelanja:this.grandtotal,
          jumlahbayar: this.jumlahbayar,
          jumlahitem:this.totalamount,
          PPN: this.pakaiPPN,
          jumlahPPN: this.jumlahppn,
          jumlahDisc: this.jumlahdisc,
          kembalian: this.kembalian,
          persenppn: this.PPN,
          persendisc: this.diskon
        }).then(async () => {
          // for (let i = 0; i < this.cart.length; i++) {
          //   this.db.collection(`Transaksi/${this.invoicenumber}/Item`).add(this.cart[i]);
          //   console.log(this.cart);
          //   this.updateStock(this.cart[i]);
          // }
          this.cart.forEach((data:any)=>{
            this.db.collection(`Transaksi/${this.invoicenumber}/Item`).add(data);
            this.updateStock(data);

          });

          

          // for(let i=0; i<2; i++)
          // {
          // }

          // this.bluetoothSerial.write('hello world')
          // this.printNota();

          loading.dismiss();
        
          this.cartService.clearCart();
          this.dataService.getData();
          window.tab1.refresh();
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

  updateStock(item: any)
  {
    this.db.doc(`Menu/${item.MenuID}`).update({stock: item.stock - item.amount}).then(async ()=>{
      this.cartService.clearCart();
      this.dataService.getData();
      window.tab1.refresh();
      window.tab1.loadData();
      const toast = await this.toastController.create({
        message: 'Stock berhasil diupdate!',
        duration: 1000,
        position: 'bottom'
      });
      await toast.present();
    })
  }

  listDevices(){
    console.log("LIST DEVICES ");
    this.bluetoothSerial.list().then(function(devices) {
      devices.forEach(function(device: any) {
        console.log("Device id: ", device.id);
        console.log("Device name: ", device.name);
      })
    }).catch((e) =>{
      console.error(e);
    });
  }
  
  printNota(){
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();
    this.img = new Image();
    this.img.src = "../assets/LOGO DESSERTIE.png";
    const tanggal = moment().format("DD/MM/YYYY");
    const waktu = moment().format("HH:mm:ss");
    const invoiceID = this.invoicenumber;
    function alignLeftRight(left:any, right:any) {
      let lineWidth = 29;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan) + "Rp "+right;
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

    function alignLeftRightBayar(left:any, right:any){
      let lineWidth = 29;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan)+"Rp "+ right;
    }

    function alignLeftRightKembalian(left:any, right:any){
      let lineWidth = 29;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan)+"Rp "+ right;
    }
    
    function alignLeftRightPPN(left:any, right:any){
      let lineWidth = 29;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan)+"Rp "+ right;
    }


 
    result
    
      .codepage('windows1250')
      .align('center')
      // .image(this.img, 240, 240, 'threshold')
      .line("DESSERTIE")
      .line("Jl. Jenderal Sudirman")
      .newline()
      .line("================================")
      .align('left')
      .text("Invoice ID: ")
      .text(invoiceID)
      .newline()
      .text("Tanggal   : ")
      .text(tanggal)
      .newline()
      .text("Waktu     : ")
      .text(waktu)
      .newline()
      .line("================================")
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
      .line(alignLeftRight('Grand Total', formatNumber(this.grandtotalkonstan, 'en-US')))
      .line(alignLeftRightPPN(`Diskon ${this.diskon}%`, formatNumber(this.jumlahdisc, 'en-US')))
      .line(alignLeftRightPPN(`PPN ${this.PPN}%`, formatNumber(this.jumlahppn, 'en-US')))
      .line(alignLeftRight('Total Belanja', formatNumber(this.grandtotal, 'en-US')))

      .line(alignLeftRightBayar('Bayar', formatNumber(parseInt(this.jumlahbayar), 'en-US')))
      .line(alignLeftRightKembalian('Kembalian', formatNumber(this.kembalian, 'en-US')))
      .newline()
      .line("================================")
      .newline()
      .newline()
      .cut();

    const resultByte = result.encode();
    // send byte code into the printer
    // this.bluetoothSerial.connect(this.MAC_ADDRESS).subscribe(() => {
    //   this.bluetoothSerial.write(resultByte)
    //     .then(async () => {
    //       this.bluetoothSerial.clear();
    //       this.bluetoothSerial.disconnect();
    //       console.log('Print success');
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //     });
    // });
    
    this.bluetoothSerial.isConnected().then(async () => {
      this.bluetoothSerial.write(resultByte)
        .then(async () => {
          this.bluetoothSerial.clear();
          // this.bluetoothSerial.disconnect();
          console.log('Print success');
          this.modalCtrl.dismiss();
        })
        .catch((err) => {
          console.error(err);
        });
    })

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

  hitungPPN()
  {
    // console.log(this.grandtotalkonstan)
    
    if(this.pakaiPPN && !this.pakaiDisc)
    {
      this.grandtotal = this.grandtotalkonstan + ((this.grandtotalkonstan * this.PPN)/100)
      this.grandtotalPPN = this.grandtotalkonstan + ((this.grandtotalkonstan * this.PPN)/100)
    }
    else if(this.pakaiPPN && this.pakaiDisc)
    {
      this.grandtotal = this.grandtotaldiskon + ((this.grandtotaldiskon * this.PPN)/100)
    }
    else{
      this.grandtotal = this.grandtotalkonstan;
    }
    console.log(this.grandtotal)
    this.HitungKembalian();
  }

  hitungDisc()
  {
    if(this.pakaiDisc && !this.pakaiPPN)
    {
      this.grandtotal = this.grandtotalkonstan - ((this.grandtotalkonstan * this.diskon)/100);
      this.grandtotaldiskon = this.grandtotalkonstan - ((this.grandtotalkonstan * this.diskon)/100);
    }
    else if(this.pakaiPPN && this.pakaiDisc)
    {
      this.grandtotal = this.grandtotalPPN - ((this.grandtotalPPN * this.diskon)/100)
    }
    else{
      this.grandtotal = this.grandtotalkonstan;
    }
    console.log(this.grandtotal)
    this.HitungKembalian();
  }

  hitunggrandtotal()
  {
    if(this.pakaiPPN && !this.pakaiDisc)
    {
      console.log("pakai PPN & tidak pakai diskon")
      this.grandtotal = this.grandtotalkonstan + ((this.grandtotalkonstan * this.PPN)/100)
      this.grandtotalPPN = this.grandtotalkonstan + ((this.grandtotalkonstan * this.PPN)/100)
    }
    else if(this.pakaiPPN && this.pakaiDisc)
    {
      console.log("pakai PPN & pakai diskon")
      this.grandtotal = this.grandtotalkonstan - ((this.grandtotalkonstan * this.diskon)/100);
      this.grandtotal = this.grandtotal + ((this.grandtotal * this.PPN)/100)

    }
    else if(this.pakaiDisc && !this.pakaiPPN)
    {
      console.log("pakai diskon & tidak pakai PPN")

      this.grandtotal = this.grandtotalkonstan - ((this.grandtotalkonstan * this.diskon)/100);
      this.grandtotaldiskon = this.grandtotalkonstan - ((this.grandtotalkonstan * this.diskon)/100);
    }
    else{
      console.log("tidak pakai PPN & tidak pakai diskon")
      this.grandtotal = this.grandtotalkonstan;
    }
    console.log(this.grandtotal)
    this.HitungKembalian();

  }

  close()
  {
    this.modalCtrl.dismiss();
  }

}
