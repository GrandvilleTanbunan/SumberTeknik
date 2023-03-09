import { Component } from '@angular/core';
import { ToastController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { BehaviorSubject } from 'rxjs';
import { AddMenuPage } from '../add-menu/add-menu.page';
import { DataService } from '../services/data.service';
import { GeneratePDFService } from '../generate-pdf.service';
import { SharexlsService } from '../services/sharexls.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  cartItemCount!: BehaviorSubject<number>;
  posisitab = 1;

  constructor(private shareXLS: SharexlsService,private alertCtrl:AlertController,private loadingCtrl: LoadingController,private generatePDF: GeneratePDFService,private dataService: DataService, private toastController: ToastController, private cartService: CartService, private modalCtrl: ModalController) {
    
    this.dataService.getData().subscribe((res: any)=>{
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  ngOnInit() {
    this.cartItemCount = this.cartService.getCartItemCount();
    // window.screen.orientation.lock('portrait');
  }

  async openCart(){
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.present();
  }

  async openAddMenu(){
    let modal = await this.modalCtrl.create({
      component: AddMenuPage,
      cssClass: 'small-modal'
    });
    modal.present();
  }

  async openExport(){
    let alert = await this.alertCtrl.create({

      subHeader: 'Export Laporan ke PDF?',
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
              try{
                this.generatePDF.createPdf();
                this.generatePDF.downloadPdf();
                loading.dismiss();

              }
              catch
              {
                loading.dismiss();
              }
              

            });
          }
        }
      ]
    });
    await alert.present();

    
  }

  async openXLS()
  {
    let alert = await this.alertCtrl.create({

      subHeader: 'Export Laporan ke XLS?',
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
              try{
                this.shareXLS.createXLS()
                loading.dismiss();

              }
              catch
              {
                loading.dismiss();
              }
              

            });
          }
        }
      ]
    });
    await alert.present();

  }

  PosisiTab(tab : any)
  {
    // console.log(tab)
    this.posisitab = tab;
  }
}
