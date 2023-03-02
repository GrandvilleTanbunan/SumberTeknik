 import { Component, OnInit } from '@angular/core';
 import {Product, CartService} from '../../services/cart.service';
import { ModalController } from '@ionic/angular';
import { InvoiceGeneratorService } from 'src/app/services/invoice-generator.service';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DataService } from 'src/app/services/data.service';

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

  checkout(){
    this.generateInvoice();
    console.log(this.invoicenumber)
    console.log(this.cart)

    this.db.collection(`Transaksi`).doc(`${this.invoicenumber}`).set({
      InvoiceID : this.invoicenumber,
      tanggal: moment().format('L'),
      hari: moment().format('dddd'),  
      waktu: moment().format('LTS'),
      timestamp: moment().format(),
      grandtotal: this.getTotal()
    }).then(()=>{
      for (let i = 0; i < this.cart.length; i++) {
        this.db.collection(`Transaksi/${this.invoicenumber}/Item`).add(this.cart[i]);
      }

      this.cartService.clearCart();
      this.dataService.getData();

    });

    
  }


  
}
