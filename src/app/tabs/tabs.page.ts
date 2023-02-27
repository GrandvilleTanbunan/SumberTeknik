import { Component } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  cartItemCount!: BehaviorSubject<number>;
  posisitab = 1;
  constructor(private toastController: ToastController, private cartService: CartService, private modalCtrl: ModalController) {
    
  }

  ngOnInit() {
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  async openCart(){
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.present();
  }

  PosisiTab(tab : any)
  {
    // console.log(tab)
    this.posisitab = tab;
  }
}
