import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, switchMap, filter, from, of } from 'rxjs';
import { collection, orderBy, where} from '@firebase/firestore';
import { collectionData, docData, Firestore, doc, addDoc, deleteDoc} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';



const STORAGE_KEY = "menu";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private storageReady = new BehaviorSubject(false);
  public menu: any = [];

  constructor(private db: AngularFirestore, private storage: Storage, private firestore: Firestore) {
    // this.init();
  }

  getData(){
    console.log("masuk get data")
    const MenuRef = collection(this.firestore, 'Menu');
    return collectionData(MenuRef,{idField: 'MenuID'});
  }

  async addData(item: any)
  {
    // const storedData = await this.storage.get(STORAGE_KEY) || [];
    // storedData.push(item);
    // return this.storage.set(STORAGE_KEY,storedData);
  }

  async removeItem(index: any)
  {
    // const storedData = await this.storage.get(STORAGE_KEY) || [];
    // storedData.splice(index, 1);
    // return this.storage.set(STORAGE_KEY,storedData);
  }

  addMenu(data:any) 
  {
    // this.addnotif(`${loggeduser} menambah brand '${namabrandku}'`);
    console.log(data);
    let tmpmenu = {
      nama : data[0].nama,
      harga: data[0].harga,
      amount: 0
    }

    const BrandRef = collection(this.firestore, 'Menu');
    return addDoc(BrandRef, tmpmenu);
  }


}
