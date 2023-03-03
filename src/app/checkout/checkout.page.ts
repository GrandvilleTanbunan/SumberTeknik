import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CartService } from '../services/cart.service';
import { DataService } from '../services/data.service';
declare var window:any;

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
  constructor(private loadingCtrl: LoadingController,private alertCtrl: AlertController,private toastController: ToastController,private cartService:CartService,private dataService:DataService,private db: AngularFirestore, private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log("ini di modal: " , this.invoicenumber)
    console.log("ini di modal: " , this.grandtotal)
    console.log("ini di modal: " , this.cart)
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
            if(this.kembalian != 0)
            {
              const loading = await this.loadingCtrl.create({
                message: 'Mohon tunggu...',
              });
          
              loading.present().then(async () => {
                this.db.collection(`Transaksi`).doc(`${this.invoicenumber}`).set({
                  InvoiceID: this.invoicenumber,
                  tanggal: moment().format('DD/MM/YYYY'),
                  hari: moment().format('dddd'),
                  waktu: moment().format('LTS'),
                  timestamp: moment().format(),
                  grandtotal: this.grandtotal,
                  jumlahbayar: this.jumlahbayar,
                  jumlahitem:this.totalamount
                }).then(async () => {
                  for (let i = 0; i < this.cart.length; i++) {
                    this.db.collection(`Transaksi/${this.invoicenumber}/Item`).add(this.cart[i]);
                  }
            
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
