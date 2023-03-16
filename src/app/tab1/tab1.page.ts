import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastController, ModalController, Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
import { App } from '@capacitor/app';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
declare var window : any;
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
  cart: any[] = [];
  cartItemCount!: BehaviorSubject<number>;

  constructor(private alertCtrl: AlertController,private routerOutlet: IonRouterOutlet, public platform: Platform, private db: AngularFirestore, private dataService: DataService, private toastController: ToastController, private cartService: CartService, private modalCtrl: ModalController) {
    // window.screen.orientation.lock('portrait');
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.presentConfirm();
        // App.exitApp();
        
      }
    });

    this.loadData();
    window.tab1 = this;
  }

  ngOnInit() {
    // this.products = this.cartService.getProducts();
    // this.products = this.cartService.getProducts();

    // this.dataService.getData().subscribe((res: any)=>{
    //   this.products = res;
    //   console.log(this.products);
    //   this.cart = this.cartService.getCart();
    //   this.cartItemCount = this.cartService.getCartItemCount();
    // });
    


    console.log(this.products)
    // this.cart = this.cartService.getCart();
    // this.cartItemCount = this.cartService.getCartItemCount();
  }

  async presentConfirm() {
    let alert = await this.alertCtrl.create({
      
      subHeader: 'Anda yakin ingin keluar aplikasi?',
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
          handler: () => {
            App.exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  loadData() {
    this.db.collection(`Menu`, ref => ref.orderBy('nama', 'asc'))
      .valueChanges({ idField: 'MenuID' })
      .subscribe((data: any) => {
        this.products = data;
        console.log(this.products)
        this.cart = this.cartService.getCart();
        this.cartItemCount = this.cartService.getCartItemCount();
      }

      );
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
    console.log(product)
    if(product.amount < product.stock)
    {
      this.cartService.addProduct(product);
    }
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
