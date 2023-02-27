import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  menu:any;
  jumlahitem = 100;
  ctritem = 0;
  itemkembar = false;
  // cart: any[] = [];
  products: any;
  cart = [];
  cartItemCount!: BehaviorSubject<number>;

  constructor(private dataService: DataService, private toastController: ToastController, private cartService: CartService, private modalCtrl: ModalController) {
    // window.screen.orientation.lock('portrait');
    
  }

  ngOnInit() {
    // this.products = this.cartService.getProducts();
    // this.products = this.cartService.getProducts();

    this.dataService.getData().subscribe((res: any)=>{
      this.products = res;
      console.log(this.products);
      this.cart = this.cartService.getCart();
      this.cartItemCount = this.cartService.getCartItemCount();
    });


    console.log(this.products)
    // this.cart = this.cartService.getCart();
    // this.cartItemCount = this.cartService.getCartItemCount();
  }

  // increment () {
  //   this.jumlahitem++;
  // }
  
  // decrement () {
  //   this.jumlahitem--;

  // }

  decreaseCartItem(product: any){
    this.cartService.decreaseProduct(product);
  }
  increaseCartItem(product: any){
    this.cartService.addProduct(product);
  }

  addToCart(product: any){
    this.cartService.addProduct(product);
  }

  async openCart(){
    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.present();
  }
}
