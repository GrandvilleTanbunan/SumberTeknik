import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-tambahstock',
  templateUrl: './tambahstock.page.html',
  styleUrls: ['./tambahstock.page.scss'],
})
export class TambahstockPage implements OnInit {
  stockbaru:any;
  item: any;
  constructor(private cartService: CartService,private alertCtrl: AlertController,private loadingCtrl: LoadingController, private toastController: ToastController, private db: AngularFirestore, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async updateStock() {
    let alert = await this.alertCtrl.create({

      subHeader: `Update stock ${this.item.nama} menjadi ${this.stockbaru} pcs?`,
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
            const loading = await this.loadingCtrl.create({
              message: 'Mohon tunggu...',
            });

            loading.present().then(async () => {

              this.db.doc(`Menu/${this.item.MenuID}`).update({ stock: this.stockbaru }).then(async () => {
                loading.dismiss();
                this.cartService.clearCart();
                const toast = await this.toastController.create({
                  message: 'Stock berhasil diupdate!',
                  duration: 1000,
                  position: 'bottom'
                });
                await toast.present().then(() => {
                  this.modalCtrl.dismiss();
                });
              })


            });
          }
        }
      ]
    });
    await alert.present();

  }

  close()
  {
    this.modalCtrl.dismiss();
  }

}
