import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { getAuth, onAuthStateChanged, updatePassword  } from "firebase/auth";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ganti-password',
  templateUrl: './ganti-password.page.html',
  styleUrls: ['./ganti-password.page.scss'],
})
export class GantiPasswordPage implements OnInit {
  email: any;
  user: any;
  newPassword1: any;
  newPassword2: any;
	credentials!: FormGroup;

  constructor(private fb: FormBuilder, private loadingCtrl:LoadingController,private alertCtrl:AlertController,private alertController:AlertController,private toastController: ToastController,private modalCtrl: ModalController) { 
    const auth = getAuth();
    this.user = auth.currentUser;
    onAuthStateChanged(auth, (user:any) => {
      if (user) {
        this.email = user.email;
        console.log(this.email);
      } else {
        console.log("Belum ada yang login")
      }
    });
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      password1: ['', [Validators.required, Validators.minLength(6)]],
			password2: ['', [Validators.required, Validators.minLength(6)]],
      
		});
  }

  async gantiPassword()
  {
    
    if(this.credentials.value.password1 == this.credentials.value.password2)
    {
      let alert = await this.alertCtrl.create({

        subHeader: `Ubah password?`,
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
                
                updatePassword(this.user, this.credentials.value.password1).then(async () => {
                  // Update successful.
                  loading.dismiss();
                  this.modalCtrl.dismiss();

                  const toast = await this.toastController.create({
                    message: 'Password berhasil diupdate',
                    duration: 1000,
                    position: 'bottom'
                  });
                  await toast.present();
                }).catch(async (error) => {
                  loading.dismiss();
                  this.showAlert("Error", "Silahkan logout kemudian login kembali untuk mengganti password!")
                  const toast = await this.toastController.create({
                    message: error,
                    duration: 5000,
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
    else
    {
      this.showAlert("Error", "Password tidak sama!")
    }
    
  }

  async showAlert(header:any, message:any) {
		const alert = await this.alertController.create({
			header,
			message,
			buttons: ['OK']
		});
		await alert.present();
	}


  close()
  {
    this.modalCtrl.dismiss();
  }

}
