import { Component } from '@angular/core';
import { ToastController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { BehaviorSubject } from 'rxjs';
import { AddMenuPage } from '../add-menu/add-menu.page';
import { DataService } from '../services/data.service';
import { GeneratePDFService } from '../generate-pdf.service';
import { SharexlsService } from '../services/sharexls.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  cartItemCount!: BehaviorSubject<number>;
  posisitab = 1;
  admin: any;
  constructor(private alertController: AlertController,private router: Router, private authService: AuthService, private shareXLS: SharexlsService,private alertCtrl:AlertController,private loadingCtrl: LoadingController,private generatePDF: GeneratePDFService,private dataService: DataService, private toastController: ToastController, private cartService: CartService, private modalCtrl: ModalController) {
    
    this.dataService.getData().subscribe((res: any)=>{
      this.cartItemCount = this.cartService.getCartItemCount();
    });

    // this.authService.observeadmin.subscribe((admin:any) => {
    //   this.admin = admin;
    //   console.log("Apakah admin: ", this.admin);
    // });
  }

  ngOnInit() {
    this.cartItemCount = this.cartService.getCartItemCount();
    // window.screen.orientation.lock('portrait');
    this.authService.observeadmin.subscribe((admin:any) => {
      this.admin = admin;
      console.log("Apakah admin: ", this.admin);
    });
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

  async logout()
  {


    let alert = await this.alertCtrl.create({

      subHeader: 'Anda yakin ingin keluar?',
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

            this.authService.logout().then(()=>{
              this.cartService.clearCart();
              this.router.navigateByUrl("/", {replaceUrl: true});
            });

            // const loading = await this.loadingCtrl.create({
            //   message: 'Mohon tunggu...',
            // });
        
            // loading.present().then(async () => {
            //   loading.dismiss();
            //   // const toast = await this.toastController.create({
            //   //   message: 'Menu berhasil diupdate',
            //   //   duration: 700,
            //   //   position: 'bottom'
            //   // });
            //   // await toast.present();

            // });
          }
        }
      ]
    });
    await alert.present();


    
  }

  PosisiTab(tab : any)
  {
    // if(tab == 3)
    // {
    //   if(this.admin == true)
    //   {
    //     this.posisitab = tab;
    //   }
    // }
    // // console.log(tab)
    this.posisitab = tab;
  }

  async showAlert(header:any) {
		const alert = await this.alertController.create({
			header,
			buttons: ['OK']
		});
		await alert.present();
  }
}
