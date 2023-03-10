import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {IonicStorageModule} from '@ionic/storage-angular'
import { Drivers } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import {PDFGenerator} from '@ionic-native/pdf-generator/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
// import { Camera } from '@ionic-native/camera';

// import { Camera, CameraResultType } from '@capacitor/camera';
// import {SocialSharing} from '@awesome-cordova-plugins/social-sharing/ngx';
// import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule,IonicStorageModule.forRoot({
    name:"mydatabase",
    driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
  }), provideFirebaseApp(() => initializeApp(environment.firebase)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: FIREBASE_OPTIONS, useValue: environment.firebase }, PDFGenerator, FileOpener, BluetoothSerial ],
  bootstrap: [AppComponent],
})
export class AppModule {}
