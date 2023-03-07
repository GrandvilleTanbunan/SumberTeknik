import { Component } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { BehaviorSubject } from 'rxjs';
import { AddMenuPage } from '../add-menu/add-menu.page';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  cartItemCount!: BehaviorSubject<number>;
  posisitab = 1;

  constructor(private dataService: DataService, private toastController: ToastController, private cartService: CartService, private modalCtrl: ModalController) {
    
    this.dataService.getData().subscribe((res: any)=>{
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  ngOnInit() {
    this.cartItemCount = this.cartService.getCartItemCount();
    // window.screen.orientation.lock('portrait');
  }

  async openCart(){
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.present();
  }

  async openAddMenu(){
    let modal = await this.modalCtrl.create({
      component: AddMenuPage,
      cssClass: 'small-modal'
    });
    modal.present();
  }

  async openExport(){
    let modal = await this.modalCtrl.create({
      component: AddMenuPage,
      cssClass: 'small-modal'
    });
    modal.present();
  }

  PosisiTab(tab : any)
  {
    // console.log(tab)
    this.posisitab = tab;
  }
}
