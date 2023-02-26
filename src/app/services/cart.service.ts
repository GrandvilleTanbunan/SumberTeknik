import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  data: Product[] = [
    {id: 0, name: 'Pizzaaaaaaaaasdawdawdawdawdd', price: 50000, amount: 0},
    {id: 1, name: 'Hamburger', price: 25000, amount: 0},
    {id: 2, name: 'Croissant', price: 10000, amount: 0},
    {id: 3, name: 'Roti', price: 5000, amount: 0}
  ];

  private cart: any = [];
  private cartItemCount = new BehaviorSubject(0);

  constructor() { }

  getProducts(){
    return this.data;
  }

  getCart(){
    return this.cart;
  }

  getCartItemCount(){
    return this.cartItemCount;
  }

  addProduct(product: any){
    let added = false;
    for (let p of this.cart) {
      if (p.id === product.id) {
        p.amount += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      product.amount = 1;
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);
  }

  decreaseProduct(product: any){
    for(let [index, p] of this.cart.entries()){
      if(p.id === product.id)
      {
        p.amount -= 1;
        if(p.amount == 0)
        {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }

  removeProduct(product: any){
    for(let [index, p] of this.cart.entries()){
      if(p.id === product.id)
      {
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
      }
    }
  }
}
