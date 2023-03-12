import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-edit-ppn',
  templateUrl: './edit-ppn.page.html',
  styleUrls: ['./edit-ppn.page.scss'],
})
export class EditPPNPage implements OnInit {
  PPN: any;
  idPPN: any;
  PPNBaru: any;
  constructor(private toastController: ToastController,private modalCtrl: ModalController, private db: AngularFirestore) {
    this.getPPN();
   }

   

  ngOnInit() {
  }

  getPPN() {
    this.db.collection(`PPN`)
      .valueChanges({idField: 'idID'})
      .subscribe((data: any) => {
        this.PPN = data[0].PPN;
        this.idPPN = data[0].idID;
        console.log('PPN: ' + this.PPN)
        // return of(this.tmptype);
      });
  }

  updatePPN()
  {
    this.db.doc(`PPN/${this.idPPN}`).update({PPN:this.PPNBaru}).then(async ()=>{
      const toast = await this.toastController.create({
        message: 'PPN berhasil diupdate!',
        duration: 1000,
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
