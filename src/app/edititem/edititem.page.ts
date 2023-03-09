import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CartService } from '../services/cart.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
// import { Camera, CameraResultType, CameraOptions } from '@capacitor/camera';
// import { Camera, CameraOptions} from '@ionic-native/camera';

@Component({
  selector: 'app-edititem',
  templateUrl: './edititem.page.html',
  styleUrls: ['./edititem.page.scss'],
})
export class EdititemPage implements OnInit {
  item: any;
  captureDataUrl: string;
  selectedImage:any;
  constructor(private fb: FormBuilder, private toastController: ToastController,private db: AngularFirestore, private alertCtrl: AlertController, private dataService: DataService, private modalCtrl: ModalController, private loadingCtrl: LoadingController) { }
  
  credentials!: FormGroup;

  ngOnInit() {
    console.log("ini di modal: " , this.item)
    this.credentials = this.fb.group({
			nama: ['', [Validators.required]],
			harga: ['', [Validators.required]]
    });

    this.credentials.patchValue({nama: this.item.nama, harga: this.item.harga})

  }

  close()
  {
    this.modalCtrl.dismiss();
  }

  async update()
  {
    let alert = await this.alertCtrl.create({

      subHeader: 'Anda yakin ingin mengupdate menu?',
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
              this.dataService.EditMenu(this.item.MenuID, this.credentials.value).then(async ()=>{
                  loading.dismiss();
                  const toast = await this.toastController.create({
                    message: 'Item berhasil diupdate',
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
  }

  checkPlatformForWeb()
  {
    if(Capacitor.getPlatform() == 'web') return true;
    return false;
  }


  async getPicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      // allowEditing: true,
      resultType: this.checkPlatformForWeb() ? CameraResultType.DataUrl : CameraResultType.Uri,
      source: CameraSource.Prompt,
      width:600
    });
    console.log('image: ', image);
    this.selectedImage = image;
    if(this.checkPlatformForWeb()) this.selectedImage.webPath = image.dataUrl;
  }

  async share()
  {
    await Share.share({
      title: 'Share Picture',
      text:'ABC',
      url: this.selectedImage.path
    })
  }

}
