import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AddMenuPage } from '../add-menu/add-menu.page';
import { EdititemPage } from '../edititem/edititem.page';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
  constructor(private toastController: ToastController,private db: AngularFirestore, private alertCtrl: AlertController, private dataService: DataService, private modalCtrl: ModalController, private loadingCtrl: LoadingController) {
    this.loadData();
  }

  loadData()
  {
    // this.listData = await this.dataService.getData();
    // this.dataService.getData().subscribe((res: any)=>{
    //   this.listData = res;
    //   console.log(this.listData);

    // });

    this.db.collection(`Menu`, ref => ref.orderBy('nama', 'asc'))
        .valueChanges({idField: 'MenuID'})
        .subscribe((data:any) => {
            this.listData = data;
            console.log(this.listData)
            // return of(this.tmptype);
        }
        
    );
  }

  async addData()
  {
    // this.tmpdata = [
    //   {nama: this.tmpnama,
    //   harga: this.tmpharga,
    //   jumlah: this.tmpjumlah}
    // ];
    // await this.dataService.addData(this.tmpdata);

    // this.loadData();

   
  }

  async openAddMenu()
  {
    let modal = await this.modalCtrl.create({
      component: AddMenuPage,
      // cssClass: 'cart-modal'
    });
    modal.present();
  }

  async removeItem(item: any)
  {
    let alert = await this.alertCtrl.create({

      subHeader: 'Anda yakin ingin menghapus menu?',
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

  async editItem(item: any)
  {
    // console.log(item);
    let modal = await this.modalCtrl.create({
      component: EdititemPage,
      cssClass: 'small-modal',
      componentProps: {
        item: item
      }
    });
    modal.present();
  }

}
