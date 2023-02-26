import { Component } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private toastController: ToastController, private cartService: CartService, private modalCtrl: ModalController) {}


  async openCart(){
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.present();
  }
}
