import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { ModalController, AlertController, LoadingController, ToastController,Platform, IonRouterOutlet } from '@ionic/angular';
import { AddMenuPage } from '../add-menu/add-menu.page';
import { EdititemPage } from '../edititem/edititem.page';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { App } from '@capacitor/app';
import { TambahstockPage } from '../tambahstock/tambahstock.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  listData: any = [];
  // tmpdata;
  tmpnama:any;
  tmpharga:any;
  tmpjumlah:any;
  admin: any
  constructor(private routerOutlet: IonRouterOutlet, public platform: Platform,private alertController: AlertController, private authService: AuthService, private toastController: ToastController,private db: AngularFirestore, private alertCtrl: AlertController, private dataService: DataService, private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
    this.loadData();
    this.authService.observeadmin.subscribe((admin:any) => {
      this.admin = admin;
      console.log("Apakah admin: ", this.admin);
    });

    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.presentConfirm();
        // App.exitApp();
        
      }
    });
  }

  async presentConfirm() {
    let alert = await this.alertCtrl.create({
      
      subHeader: 'Anda yakin ingin keluar aplikasi?',
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
          handler: () => {
            App.exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  loadData()
  {
    this.db.collection(`Menu`, ref => ref.orderBy('nama', 'asc'))
        .valueChanges({idField: 'MenuID'})
        .subscribe((data:any) => {
            this.listData = data;
            console.log(this.listData)
            // return of(this.tmptype);
        }
    );
  }

  async openTambahStock(item:any){
    if(this.admin == true)
    {
      console.log("apakah admin ini: " + this.admin)
      let modal = await this.modalCtrl.create({
        component: TambahstockPage,
        cssClass: 'extra-small-modal',
        componentProps: {
          item: item
        }
      });
      modal.present();
    }
    else
    {
      this.showAlert("Admin", "Login sebagai admin untuk menggunakan fitur ini")
    }
    
  }


  async removeItem(item: any)
  {
    if(this.admin)
    {
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin menghapus menu ${item.nama}?`,
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
                this.dataService.deleteMenu(item.MenuID).then(async ()=>{
                    loading.dismiss();
                    const toast = await this.toastController.create({
                      message: 'Item berhasil dihapus',
                      duration: 700,
                      position: 'bottom'
                    });
                    await toast.present();
                });
                
              });
            }
          }
        ]
      });
      await alert.present();
      console.log(item)
    }
    else
    {
      this.showAlert("Admin", "Login sebagai admin untuk menggunakan fitur ini")
    }


    
  }

  async editItem(item: any)
  {
    if(this.admin)
    {
      let modal = await this.modalCtrl.create({
        component: EdititemPage,
        cssClass: 'small-modal',
        componentProps: {
          item: item
        }
      });
      modal.present();
    }
    else
    {
      this.showAlert("Admin", "Login sebagai admin untuk menggunakan fitur ini")
    }
   
  }

  async showAlert(header:any, subheader: any) {
		const alert = await this.alertController.create({
      header,
      subHeader: subheader,
			buttons: ['OK']
		});
		await alert.present();
  }

}
