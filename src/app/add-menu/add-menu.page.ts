import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CartService } from '../services/cart.service';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { collectionData, docData, Firestore, doc, addDoc, deleteDoc, setDoc} from '@angular/fire/firestore';

import { Share } from '@capacitor/share';
import { Storage, ref } from '@angular/fire/storage';
import { uploadString } from 'rxfire/storage';
import { getDownloadURL } from '@firebase/storage';
// import * as firebase from "firebase";

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

  constructor(private firestore: Firestore, private storage:Storage, private cartService: CartService,private dataService: DataService, private modalCtrl: ModalController, private fb: FormBuilder, private loadingController:LoadingController, private alertController:AlertController, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.credentials = this.fb.group({
			nama: ['', [Validators.required]],
			harga: ['', [Validators.required]]
		});
  }

  get nama(){
    return this.credentials.get('nama');
  }

  get harga(){
    return this.credentials.get('harga');
  }

  async saveItem()
  {
    console.log("masuk sini")
    this.submitted = true;
    this.tmpdata = [
      {nama: this.credentials.value.nama,
      harga: this.credentials.value.harga
      }
    ];

    console.log(this.tmpdata)
    await this.dataService.addMenu(this.tmpdata).then(()=>{
      this.cartService.clearCart();
    });
    // this.loadData();
    this.dataService.getData();

    console.log(this.dataService.MenuIDNew);

    const path = `FoodImage/${this.dataService.MenuIDNew}.jpeg`;
    const storageRef = ref(this.storage, path);

    try{
      await uploadString(storageRef, this.selectedImage.base64String, 'base64');

      // const imageUrl = await getDownloadURL(storageRef);

      // const userDocRef = doc(this.firestore, `Menu/${this.dataService.MenuIDNew}`);
      // await setDoc(userDocRef, {
      //   imageUrl
      // });
      return true;

    }
    catch(e){
      return null;
    }
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
