import { Component } from '@angular/core';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private db: AngularFirestore, private authService: AuthService, private dataService: DataService) {
    const auth = getAuth();

    onAuthStateChanged(auth, (user:any) => {
      if (user) {
        // console.log(user)
        const email = user.email;
        this.authService.setloggeduser(email);
        
        console.log(email);
      } else {
        console.log("Belum ada yang login")
      }
    });
  }
}
