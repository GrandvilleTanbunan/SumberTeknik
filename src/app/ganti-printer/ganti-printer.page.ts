import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ganti-printer',
  templateUrl: './ganti-printer.page.html',
  styleUrls: ['./ganti-printer.page.scss'],
})
export class GantiPrinterPage implements OnInit {

  MAC_ADDRESS: any;
  macbaru: any;
  idmac: any;
  constructor(private db: AngularFirestore, private modalCtrl: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    this.getMAC();
  }

  getMAC()
  {
    this.db.collection(`MACPrinter`)
        .valueChanges({idField: 'idmac'})
        .subscribe((data:any) => {
            this.MAC_ADDRESS = data[0].MAC;
            this.idmac = data[0].idmac;

            console.log('MAC: '+this.MAC_ADDRESS)
        }
        
    );
  }

  updatePrinter()
  {
    this.db.doc(`MACPrinter/${this.idmac}`).update({MAC:this.macbaru}).then(async ()=>{
      const toast = await this.toastController.create({
        message: 'Printer berhasil diupdate!',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present().then(()=>{
        this.modalCtrl.dismiss();
      });
    }) //<-- $rating is dynamic
  }

  close()
  {
    this.modalCtrl.dismiss();
  }

}
