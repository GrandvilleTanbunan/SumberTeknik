import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AddUserPage } from '../add-user/add-user.page';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  profile = null;
  constructor(private modalCtrl:ModalController,private cartService:CartService,private authService: AuthService, private fb: FormBuilder, private loadingController:LoadingController, private alertController:AlertController, private router: Router) { }

  ngOnInit() {
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
