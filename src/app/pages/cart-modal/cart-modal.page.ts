 import { Component, OnInit } from '@angular/core';
 import {Product, CartService} from '../../services/cart.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {

  cart: any[] = [];

  constructor(private cartService: CartService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.cart = this.cartService.getCart();
  }

  decreaseCartItem(product: any){
    this.cartService.decreaseProduct(product);
  }
  increaseCartItem(product: any){
    this.cartService.addProduct(product);
  }
  removeCartItem(product: any){
    this.cartService.removeProduct(product);
  }
  getTotal(){
    return this.cart.reduce((i, j)=> i + j.harga * j.amount, 0);
  }
  close(){
    this.modalCtrl.dismiss();
  }

  checkout(){
    
  }

}
