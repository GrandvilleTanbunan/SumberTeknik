import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AddUserPage } from '../add-user/add-user.page';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  profile: any;
  loggeduser: any;
  selectedImage:any;
  constructor(private dataService: DataService,private db: AngularFirestore, private modalCtrl:ModalController,private cartService:CartService,private authService: AuthService, private fb: FormBuilder, private loadingController:LoadingController, private alertController:AlertController, private router: Router) { 

  }

  ngOnInit() {
    this.authService.loginStatus$.subscribe((user:any) => {
      this.loggeduser = user;
      console.log("logged user: ", this.loggeduser);
      this.getDP();
    });


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

  

  isiprofile(data:any)
  {
    for(let i=0; i<data.length; i++)
    {
      this.profile = data[i]
    }
  }

  logout()
  {
    this.authService.logout().then(()=>{
      this.cartService.clearCart();
      this.router.navigateByUrl("/", {replaceUrl: true});
    });
  }

  async addUser()
  {
    let modal = await this.modalCtrl.create({
      component: AddUserPage,
      cssClass: 'small-modal'
    });
    modal.present();
  }

}
