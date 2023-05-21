import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { collection, orderBy, where} from '@firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface Product {
  id: number;
  name: string;
  price: number;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  listData: any = [];

  data: Product[] = [
    {id: 0, name: 'Pizzaaaaaaaaasdawdawdawdawdd', price: 50000, amount: 0},
    {id: 1, name: 'Hamburger', price: 25000, amount: 0},
    {id: 2, name: 'Croissant', price: 10000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0},

  ];



  private cart: any = [];
  private cartItemCount = new BehaviorSubject(0);

  constructor(private dataService: DataService, private db: AngularFirestore) { 
    this.loadData();
  }

  public async loadData()
  {
    // this.listData = await this.dataService.getData();
    this.dataService.getData().subscribe((res: any)=>{
      this.listData = res;
      console.log(this.listData);

    });

  }

  getProducts(){
    this.loadData().then(()=>{
      console.log(this.listData);

      return this.listData;
    });
    
  }

  getCart(){
    return this.cart;
  }

  getCartItemCount(){
    return this.cartItemCount;
  }

  clearCart()
  {
    this.cart = [];
    this.cartItemCount.next(0);
  }

  // addamount()
  // {

  // }

  async addProduct(product: any){
    const UpdateAmount = this.db.collection(`Menu`).doc(`${product.MenuID}`);

    // console.log(product)
    let added = false;
    for (let p of this.cart) {
      if (p.MenuID === product.MenuID) {
        p.amount += 1;
        added = true;
    
        // const res1 = await UpdateAmount.update({amount: p.amount});
        break;
      }
    }
    if (!added) {
      product.amount = 1;
      // const res1 = await UpdateAmount.update({amount: 1});

      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);
    console.log(this.cart)
  }

  

  async decreaseProduct(product: any){
    const UpdateAmount = this.db.collection(`Menu`).doc(`${product.MenuID}`);

    console.log(product)

    for(let [index, p] of this.cart.entries()){
      if(p.MenuID === product.MenuID)
      {
        p.amount -= 1;
        // const res1 = await UpdateAmount.update({amount: p.amount});

        if(p.amount == 0)
        {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
    console.log(this.cart)
  }

  async removeProduct(product: any){
    const UpdateAmount = this.db.collection(`Menu`).doc(`${product.MenuID}`);

    for(let [index, p] of this.cart.entries()){
      if(p.MenuID === product.MenuID)
      {
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
        console.log("Masuk Sini")
        p.amount = 0;
        // const res1 = await UpdateAmount.update({amount: p.amount});


        
      }
    }
    console.log(this.cart)

  }
}
