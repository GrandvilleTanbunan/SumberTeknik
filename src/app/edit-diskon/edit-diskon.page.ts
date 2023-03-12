import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-edit-diskon',
  templateUrl: './edit-diskon.page.html',
  styleUrls: ['./edit-diskon.page.scss'],
})
export class EditDiskonPage implements OnInit {
  diskon:any;
  diskonBaru: any;
  iddiskon: any;
  constructor(private modalCtrl: ModalController, private db: AngularFirestore, private toastController: ToastController) { }

  ngOnInit() {
    this.getDiskon();
  }

  getDiskon() {
    this.db.collection(`Diskon`)
      .valueChanges({idField: 'idDiskon'})
      .subscribe((data: any) => {
        this.diskon = data[0].diskon;
        this.iddiskon = data[0].idDiskon;
        console.log('Diskon: ' + this.diskon)
        // return of(this.tmptype);
      });
  }

  updateDiskon()
  {
    this.db.doc(`PPN/${this.iddiskon}`).update({diskon:this.diskonBaru}).then(async ()=>{
      const toast = await this.toastController.create({
        message: 'Diskon berhasil diupdate!',
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
