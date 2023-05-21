import { Injectable } from '@angular/core';
// import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, switchMap, filter, from, of } from 'rxjs';
import { collection, orderBy, where} from '@firebase/firestore';
import { collectionData, docData, Firestore, doc, addDoc, deleteDoc} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { uploadString } from 'rxfire/storage';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';



const STORAGE_KEY = "menu";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private storageReady = new BehaviorSubject(false);
  public menu: any = [];
  public MenuIDNew : any;
  loggeduser:any;
  loggeduserID:any
  imageUrl:any;
  constructor(private toastController: ToastController , private authService: AuthService, private db: AngularFirestore, private storage: Storage, private firestore: Firestore) {
    // this.init();
    this.authService.loginStatus$.subscribe((user:any) => {
      this.loggeduser = user;
      console.log("logged user: ", this.loggeduser);
    });

    this.authService.observedeuserID.subscribe((user:any) => {
      this.loggeduserID = user;
      console.log("logged user: ", this.loggeduser);
    });
  }

  getData(){
    console.log("masuk get data")
    const MenuRef = collection(this.firestore, 'Menu');
    return collectionData(MenuRef,{idField: 'MenuID'});

    // this.db.collection(`Menu`, ref => ref.orderBy('nama', 'asc'))
    //     .valueChanges()
    //     .subscribe((data:any) => {
    //         this.menu = data;
    //         console.log(this.menu)
    //         // return of(this.tmptype);
    //     }
        
    // );
    // return of(this.menu);

  }

  async uploadDP(selectedImage: any) {
    const path = `ProfilePicture/${this.authService.UserID}.jpeg`;
    const storageRef = ref(this.storage, path);
    // console.log(this.storage)
    try {
      await uploadString(storageRef, selectedImage, 'data_url').toPromise().then(async (snapshot: any) => {
        console.log('Uploaded a raw string!');
        this.getURL(storageRef).then(async () => {
          const toast = await this.toastController.create({
            message: 'Foto berhasil diganti!',
            duration: 2000,
            position: 'bottom'
          });
          await toast.present();
        });

      });
      return true;
    }
    catch (e) {
      return null;
    }
  }

  async getURL(storageRef: any)
  {
    console.log(this.authService.UserID)
    this.imageUrl = await getDownloadURL(storageRef);
    console.log(this.imageUrl)
    // console.log(this.selectedImage)
    console.log("masuk sini")

    this.db.doc(`User/${this.loggeduserID}`).update({imageUrl:this.imageUrl}); //<-- $rating is dynamic
  }


  async addMenu(data:any) 
  {
    // this.addnotif(`${loggeduser} menambah brand '${namabrandku}'`);
    console.log(data);
    let tmpmenu = {
      nama : data[0].nama,
      harga: data[0].harga,
      amount: 0,
      imageUrl: "",
      kategori: data[0].kategori
    }

    const res = await this.db.collection(`Menu`).add(tmpmenu);
    this.MenuIDNew = res.id;
    console.log(this.MenuIDNew);

    // const BrandRef = collection(this.firestore, 'Menu');
    // return addDoc(BrandRef, tmpmenu);
  }

  async EditMenu(MenuID: any, item : any, image: any)
  {
    const UpdateHarga = this.db.collection(`Menu`).doc(`${MenuID}`);
    
    const res1 = await UpdateHarga.update({harga: item.harga, nama:item.nama, imageUrl:image});
    
  }

  deleteMenu(MenuID: any)
  {
    const TypeRef = doc(this.firestore, `Menu/${MenuID}`);
    return deleteDoc(TypeRef);
  }

}
