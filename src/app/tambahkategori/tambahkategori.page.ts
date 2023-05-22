import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tambahkategori',
  templateUrl: './tambahkategori.page.html',
  styleUrls: ['./tambahkategori.page.scss'],
})
export class TambahkategoriPage implements OnInit {

  namakategori: any;
  togglevalue= false;
  kategori: any;
  selectedkategori: any;
  constructor(private db: AngularFirestore, private modalCtrl: ModalController, private dataService: DataService, private alertCtrl: AlertController, private toastController: ToastController) { }

  ngOnInit() {
    this.getkategori()
  }

  getkategori()
  {
    this.db.collection(`Kategori`)
      .valueChanges({ idField: 'KategoriID' })
      .subscribe((data: any) => {
        this.kategori = data;
        console.log(this.kategori)
      }

      );
  }

  async simpankategori() {
    if(this.namakategori==undefined)
    {
      let alert = await this.alertCtrl.create({
        subHeader: 'Masukkan nama kategori!',
        buttons: ['Dismiss']
      });
      await alert.present();
    }
    else
    {
      let alert = await this.alertCtrl.create({

        subHeader: `Tambah Kategori ${this.namakategori}?`,
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
              this.dataService.addKategori(this.namakategori);
              const toast = await this.toastController.create({
                message: 'Berhasil menyimpan kategori!',
                duration: 1000,
                position: 'bottom'
              });
              await toast.present().then(()=>{
                this.modalCtrl.dismiss();
              });
            }
          }
        ]
      });
      await alert.present();
    }
    
  }

  async hapusKategori()
  {
    console.log(this.selectedkategori)
    if(this.selectedkategori == undefined)
    {
      let alert = await this.alertCtrl.create({
        subHeader: 'Pilih kategori!',
        buttons: ['Dismiss']
      });
      await alert.present();
    }
    else
    {
      let alert = await this.alertCtrl.create({

        subHeader: `Hapus Kategori ${this.selectedkategori.namakategori}?`,
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
              this.dataService.hapusKategori(this.selectedkategori.KategoriID);
              const toast = await this.toastController.create({
                message: 'Berhasil menghapus kategori!',
                duration: 1000,
                position: 'bottom'
              });
              await toast.present().then(()=>{
                this.modalCtrl.dismiss();
              });
            }
          }
        ]
      });
      await alert.present();
    }
      
    
    
  }

  toggleHapusTambah()
  {
    console.log(this.togglevalue)
  }

  close()
  {
    this.modalCtrl.dismiss();
  }


}
