import { Component } from '@angular/core';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
// import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private androidPermissions: AndroidPermissions,private db: AngularFirestore, private authService: AuthService, private dataService: DataService) {
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
    
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT).then(
      result => {
        if(result.hasPermission){
          //Do nothing and proceed permission exists already
        }else{
          //Request for all the permissions in the array
          this.androidPermissions.requestPermissions(
            [
              this.androidPermissions.PERMISSION.BLUETOOTH, 
              this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
              this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
              this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
              this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
           ])
        }
      },
      err => this.androidPermissions.requestPermissions(
        [
          this.androidPermissions.PERMISSION.BLUETOOTH, 
          this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
          this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
          this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
       ])
    );
  }

}
