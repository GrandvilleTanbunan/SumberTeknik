import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { LoadingController, AlertController, ModalController, Platform, IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AddUserPage } from '../add-user/add-user.page';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DataService } from '../services/data.service';
import { EditPPNPage } from '../edit-ppn/edit-ppn.page';
import { EditDiskonPage } from '../edit-diskon/edit-diskon.page';
import { App } from '@capacitor/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GantiPasswordPage } from '../ganti-password/ganti-password.page';
// import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { TambahkategoriPage } from '../tambahkategori/tambahkategori.page';
import { GantiPrinterPage } from '../ganti-printer/ganti-printer.page';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  profile: any;
  loggeduser: any;
  selectedImage:any;
  admin: any;
  email: any;

  constructor(private androidPermissions: AndroidPermissions, private alertCtrl: AlertController,private routerOutlet: IonRouterOutlet, public platform: Platform,private dataService: DataService,private db: AngularFirestore, private modalCtrl:ModalController,private cartService:CartService,private authService: AuthService, private fb: FormBuilder, private loadingController:LoadingController, private alertController:AlertController, private router: Router) { 

  }

  ngOnInit() {
    this.authService.loginStatus$.subscribe((user:any) => {
      this.loggeduser = user;
      console.log("logged user: ", this.loggeduser);
      this.getDP();
    });

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

  getDP()
  {
    this.profile = undefined
    console.log(this.loggeduser)
    this.db.collection(`User`, ref => ref.where('email', '==', `${this.loggeduser}`))
      .valueChanges({idField: 'userID'})
      .subscribe((data:any) => {
          // this.profile = data;
          this.isiprofile(data);
          // console.log(this.profile)
      });
  }

  async changeImage()
  {
    // const image = await Camera.getPhoto({
    //   quality: 90,
    //   // allowEditing: true,
    //   // resultType: this.checkPlatformForWeb() ? CameraResultType.DataUrl : CameraResultType.Uri,
    //   // resultType: CameraResultType.Base64,
    //   resultType: CameraResultType.DataUrl,
    //   source: CameraSource.Prompt
    // })
    // if(image)
    // {
    //   const loading = await this.loadingController.create();
    //   await loading.present();

    //   const result = await this.dataService.uploadDP(image)
    // }
    // console.log('image: ', image);

    const image = await Camera.getPhoto({
      quality: 90,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    }).then((image:any) => {
      this.selectedImage = image.dataUrl; // VAR TO DISPLAY IN HTML
      this.dataService.uploadDP(this.selectedImage)
      console.log('image: ', image);

    })
  }

  async editPPN()
  {
    let modal = await this.modalCtrl.create({
      component: EditPPNPage,
      cssClass: 'extra-small-modal'
    });
    modal.present();
  }

  async editDiskon()
  {
    let modal = await this.modalCtrl.create({
      component: EditDiskonPage,
      cssClass: 'extra-small-modal'
    });
    modal.present();
  }

  isiprofile(data:any)
  {
    for(let i=0; i<data.length; i++)
    {
      this.profile = data[i]
    }
  }

  async gantiPassword()
  {
    let modal = await this.modalCtrl.create({
      component: GantiPasswordPage,
      cssClass: 'extra-small-modal'
    });
    modal.present();
  }

  async gantiPrinter()
  {
    let modal = await this.modalCtrl.create({
      component: GantiPrinterPage,
      cssClass: 'extra-small-modal'
    });
    modal.present();
  }

  async addUser()
  {
    let modal = await this.modalCtrl.create({
      component: AddUserPage,
      cssClass: 'small-modal',
      componentProps: {
        profil: this.profile
      }
    });
    modal.present();
  }

  async tambahkategori()
  {
    let modal = await this.modalCtrl.create({
      component: TambahkategoriPage,
      cssClass: 'extra-small-modal',
      // componentProps: {
      //   profil: this.profile
      // }
    });
    modal.present();
  }

  reqPermission()
  {
    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
    //   result => console.log('Has permission?',result.hasPermission),
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    // );
    // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);

    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_SCAN).then(
    //   result => console.log('Has permission?',result.hasPermission),
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_SCAN)
    // );
    // this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.BLUETOOTH_SCAN);

    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT).then(
    //   result => console.log('Has permission?',result.hasPermission),
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT)
    // );
    // this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT);

    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN).then(
    //   result => console.log('Has permission?',result.hasPermission),
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN)
    // );
    // this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN);

    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH).then(
    //   result => console.log('Has permission?',result.hasPermission),
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH)
    // );
    // this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.BLUETOOTH);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT).then(
      result => {
        if(result.hasPermission){
          //Do nothing and proceed permission exists already
        }else{
          //Request for all the permissions in the array
          this.androidPermissions.requestPermissions(
            [
              this.androidPermissions.PERMISSION.BLUETOOTH, 
              this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
              this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
              this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
              this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
           ])
        }
      },
      err => this.androidPermissions.requestPermissions(
        [
          this.androidPermissions.PERMISSION.BLUETOOTH, 
          this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
          this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
          this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
       ])
    );
  }

  logout()
  {
    this.authService.logout().then(()=>{
      this.cartService.clearCart();
      this.router.navigateByUrl("/", {replaceUrl: true});
    });
  }

}
