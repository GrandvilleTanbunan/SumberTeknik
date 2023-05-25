import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CartService } from '../services/cart.service';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { collectionData, docData, Firestore, doc, addDoc, deleteDoc, setDoc} from '@angular/fire/firestore';

import { Share } from '@capacitor/share';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { uploadString } from 'rxfire/storage';
// import { getDownloadURL } from '@firebase/storage';
// import * as firebase from "firebase";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.page.html',
  styleUrls: ['./add-menu.page.scss'],
})
export class AddMenuPage implements OnInit {
  credentials!: FormGroup;
  submitted = false;
  tmpdata: any;
  tmpnama:any;
  tmpharga:any;
  selectedImage:any;
  kategori: any;
  constructor(private alertCtrl:AlertController, private loadingCtrl:LoadingController, private toastController: ToastController,private db: AngularFirestore, private firestore: Firestore, private storage:Storage, private cartService: CartService,private dataService: DataService, private modalCtrl: ModalController, private fb: FormBuilder, private loadingController:LoadingController, private alertController:AlertController, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.credentials = this.fb.group({
			nama: ['', [Validators.required]],
      harga: ['', [Validators.required]],
      kategori: ['', [Validators.required]]
    });
    
    this.getkategori();
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

  selectedkategori()
  {
    console.log(this.credentials.value.kategori)
  }

  get nama(){
    return this.credentials.get('nama');
  }

  get harga(){
    return this.credentials.get('harga');
  }

  async saveItem()
  {
    let alert = await this.alertCtrl.create({

      subHeader: `Tambah menu ${this.credentials.value.nama}?`,
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

              this.tmpdata = [
                {
                  nama: this.credentials.value.nama,
                  harga: this.credentials.value.harga,
                  imageUrl: "",
                  kategori: this.credentials.value.kategori,
                  stock: 0
                }
              ];

              console.log(this.tmpdata)
              await this.dataService.addMenu(this.tmpdata).then(() => {
                this.cartService.clearCart();
              });
              // this.loadData();

              console.log(this.dataService.MenuIDNew);

              this.submitted = true;
              const path = `FoodImage/${this.dataService.MenuIDNew}.jpeg`;
              const storageRef = ref(this.storage, path);
              // console.log(this.storage)
              if(this.selectedImage != undefined)
              {
                try {
                  await uploadString(storageRef, this.selectedImage, 'data_url').toPromise().then(async (snapshot: any) => {
                    console.log('Uploaded a raw string!');
                    this.getURL(storageRef).then(async ()=>{
                        this.modalCtrl.dismiss();
                        loading.dismiss();
                        const toast = await this.toastController.create({
                          message: 'Menu berhasil ditambahkan!',
                          duration: 700,
                          position: 'bottom'
                        });
                        await toast.present();
                    });
                    
                  });
                  return true;
                }
                catch (e) {
                  return null;
                }
              }
              else
              {
                this.modalCtrl.dismiss();
                loading.dismiss();
                const toast = await this.toastController.create({
                  message: 'Menu berhasil ditambahkan!',
                  duration: 700,
                  position: 'bottom'
                });
                await toast.present();
                return true;

              }
              
              

            });
          }
        }
      ]
    });
    await alert.present();


  }

  async getURL(storageRef: any)
  {
    const imageUrl = await getDownloadURL(storageRef);
    console.log(imageUrl)
    // console.log(this.selectedImage)
    console.log("masuk sini")

    this.db.doc(`Menu/${this.dataService.MenuIDNew}`).update({imageUrl:imageUrl}); //<-- $rating is dynamic
  }



  checkPlatformForWeb()
  {
    if(Capacitor.getPlatform() == 'web') return true;
    return false;
  }


  async getPicture() {
    this.selectedImage = undefined;
    const image = await Camera.getPhoto({
      quality: 90,
      // allowEditing: true,
      // resultType: this.checkPlatformForWeb() ? CameraResultType.DataUrl : CameraResultType.Uri,
      // resultType: CameraResultType.Base64,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    })
      .then((image:any) => {
        this.selectedImage = image.dataUrl; // VAR TO DISPLAY IN HTML
      })
    console.log('image: ', image);
    // this.selectedImage = image;
    // if(this.checkPlatformForWeb()) this.selectedImage.webPath = image.dataUrl;
  }

  async share()
  {
    // console.log(this.selectedImage.path)
    await Share.share({
      title: 'Share Picture',
      text:'ABC',
      url: this.selectedImage.path
    })
  }


  

  close()
  {
    this.modalCtrl.dismiss();
  }


}
