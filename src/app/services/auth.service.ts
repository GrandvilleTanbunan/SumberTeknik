import { Injectable } from '@angular/core';
import { signOut, Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, Observable, BehaviorSubject, from, of } from 'rxjs';   

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  UserID : any
  userIDLogged : any

  user: any;
  loggeduser: any;
  admin :any
  private _statusChange$ = new BehaviorSubject<string>('');
  loginStatus$ = this._statusChange$.asObservable();

  private apakahadmin = new BehaviorSubject<string>('');
  observeadmin = this.apakahadmin.asObservable();

  private detailuser = new BehaviorSubject<string>('');
  observedeuserID = this.detailuser.asObservable();

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
      this.loggeduser = email;
      this.cekAdmin(this.loggeduser)
      console.log("logged user: " + this.loggeduser)
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
    // console.log(this.UserID);

    // const BrandRef = collection(this.firestore, 'Menu');
    // return addDoc(BrandRef, tmpmenu);
  }

  setloggeduser(email: string) {
    // console.log("Masuk set logged user")
    this.loggeduser = email;
    this._statusChange$.next(email);
    this.cekAdmin(email);
  }

  cekAdmin(email: string)
  {
    console.log(email)
    this.db.collection(`User`)
        .valueChanges({idField: 'UserID'})
        .subscribe((data:any) => {
            this.user = data;
            // console.log(this.user);
            // console.log(data)
            this.setAdmin();
            // this.apakahadmin.next(data[0].admin);
            
            // return of(this.tmptype);
        }
        
    );
  }

  setAdmin()
  {
    console.log(this.user)
    let emailterdaftar = false;
    // console.log(this.loggeduser)
    for(let i=0; i<this.user.length; i++)
    {
      // console.log(this.user[i].email)
      if(this.user[i].email == this.loggeduser)
      {
        this.admin = this.user[i].admin;
        this.userIDLogged = this.user[i].UserID;
        // console.log(this.admin);
      }
    }
    // console.log(user)
    // console.log("apakah ini admin: " + user[0].admin);
    this.apakahadmin.next(this.admin); 
    this.detailuser.next(this.userIDLogged)
  }

  logout(){
    return signOut(this.auth);
  }
}
