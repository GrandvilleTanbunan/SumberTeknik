import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, switchMap, filter, from, of } from 'rxjs';

const STORAGE_KEY = "menu";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private storageReady = new BehaviorSubject(false);
  constructor(private storage: Storage) {
    this.init();
  }

  async init(){
    console.log("INIT")
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
    console.log("DONE");
    this.storageReady.next(true);
  }

  getData(){
    console.log('GET DATA');
    return this.storageReady.pipe(
      filter((ready: any)=>ready),
      switchMap( (_: any) =>{
        console.log("ok lets go");
        return from(this.storage.get("menu")) || of([]); 
      })
    )
    
  }

  async addData(item: any)
  {
    const storedData = await this.storage.get(STORAGE_KEY) || [];
    storedData.push(item);
    return this.storage.set(STORAGE_KEY,storedData);
  }

  async removeItem(index: any)
  {
    const storedData = await this.storage.get(STORAGE_KEY) || [];
    storedData.splice(index, 1);
    return this.storage.set(STORAGE_KEY,storedData);
  }


}
