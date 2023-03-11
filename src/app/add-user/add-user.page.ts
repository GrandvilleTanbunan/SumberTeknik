import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { uploadString } from 'rxfire/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  selectedImage:any;
  admin: any;
  constructor(private db: AngularFirestore, private toastController: ToastController,private storage:Storage, private alertController:AlertController, private router: Router, private authService: AuthService, private loadingController: LoadingController,private fb: FormBuilder, private modalCtrl: ModalController) { }
  credentials!: FormGroup;
  imageUrl:any;
  ngOnInit() {
    // console.log("ini di modal: " , this.item)
    this.credentials = this.fb.group({
			email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      admin:[false]
    });
    // this.selectedImage = this.item.imageUrl;
    // this.credentials.patchValue({nama: this.item.nama, harga: this.item.harga})


  }

  Admin(){
    console.log(this.admin)
  }

  async register() {
		const loading = await this.loadingController.create();
		await loading.present();

		const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();
    
    

		if (user) {
			this.showAlert(`Registrasi berhasil!`);      
      // this.router.navigateByUrl('', { replaceUrl: true });
      this.authService.addUser(this.credentials.value).then(()=>{
        this.uploadDP();
      })
      this.modalCtrl.dismiss();
		} else {
			this.showAlert('Registrasi gagal!');
    }
    
    console.log(this.credentials.value.admin)
  }
  
  async uploadDP() {
    const path = `ProfilePicture/${this.authService.UserID}.jpeg`;
    const storageRef = ref(this.storage, path);
    // console.log(this.storage)
    try {
      await uploadString(storageRef, this.selectedImage, 'data_url').toPromise().then(async (snapshot: any) => {
        console.log('Uploaded a raw string!');
        this.getURL(storageRef).then(async () => {
          const toast = await this.toastController.create({
            message: 'Foto berhasil ditambahkan!',
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

  async getURL(storageRef: any)
  {
    this.imageUrl = await getDownloadURL(storageRef);
    console.log(this.imageUrl)
    // console.log(this.selectedImage)
    console.log("masuk sini")

    this.db.doc(`User/${this.authService.UserID}`).update({imageUrl:this.imageUrl}); //<-- $rating is dynamic
  }


  async getPicture() {
    // this.selectedImage = undefined;
    const image = await Camera.getPhoto({
      quality: 90,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    }).then((image:any) => {
      this.selectedImage = image.dataUrl; // VAR TO DISPLAY IN HTML
      console.log('image: ', image);

    })
  }

  async showAlert(header:any) {
		const alert = await this.alertController.create({
			header,
			buttons: ['OK']
		});
		await alert.present();

  }

  close()
  {
    this.modalCtrl.dismiss();
  }
}
