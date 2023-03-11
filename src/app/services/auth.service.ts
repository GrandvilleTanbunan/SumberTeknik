import { Injectable } from '@angular/core';
import { signOut, Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  UserID : any
  constructor(private auth: Auth, private db: AngularFirestore) { }

  async register({email, password} : {email:any, password:any}){
    try{
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      return user;
    }catch(e){
      return null;
    }
    
  }

  async login({email, password} : {email:any, password:any}){
    try{
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    }catch(e){
      return null;
    }
  }

  async addUser(data:any) 
  {
    // this.addnotif(`${loggeduser} menambah brand '${namabrandku}'`);
    console.log(data);
    let tmpuser = {
      email : data.email,
      admin: data.admin,
      imageUrl: ""
    }

    const res = await this.db.collection(`User`).add(tmpuser);
    this.UserID = res.id;
    console.log(this.UserID);

    // const BrandRef = collection(this.firestore, 'Menu');
    // return addDoc(BrandRef, tmpmenu);
  }

  logout(){
    return signOut(this.auth);
  }
}
