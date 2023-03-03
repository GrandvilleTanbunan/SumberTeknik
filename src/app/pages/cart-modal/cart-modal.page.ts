 import { Component, OnInit } from '@angular/core';
 import {Product, CartService} from '../../services/cart.service';
import { ModalController } from '@ionic/angular';
import { InvoiceGeneratorService } from 'src/app/services/invoice-generator.service';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DataService } from 'src/app/services/data.service';
import { Router } from "@angular/router";
import { CheckoutPage } from 'src/app/checkout/checkout.page';
declare var window:any;
@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {

  cart: any[] = [];
  invoicenumber: any;
  constructor(private dataService: DataService,private db: AngularFirestore, private invoicegenerator: InvoiceGeneratorService, private cartService: CartService, private modalCtrl: ModalController) { 
    moment.locale('id');
  }

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

  generateInvoice()
  {
    this.invoicenumber = this.invoicegenerator.generateinvoice();
  }

  async checkout(){
    this.generateInvoice();
    console.log(this.invoicenumber)
    console.log(this.cart)
    
    let modal = await this.modalCtrl.create({
      component: CheckoutPage,
      // cssClass: 'cart-modal'
      componentProps: {
        cart: this.cart,
        grandtotal:this.getTotal(),
        invoicenumber: this.invoicenumber
      }
    });

    modal.onDidDismiss().then(()=>{
      // this.cartService.clearCart();
      // this.dataService.getData();
      this.ngOnInit();
      this.modalCtrl.dismiss();

    })
    modal.present();
    


    
  }


  
}
