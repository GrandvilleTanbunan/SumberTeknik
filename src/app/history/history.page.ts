import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { DetailtransaksihariiniPageModule } from '../detailtransaksihariini/detailtransaksihariini.module';
import { DetailtransaksihariiniPage } from '../detailtransaksihariini/detailtransaksihariini.page';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  tanggalhariini: any;
  allitem: any;
  constructor(private modalCtrl: ModalController, private db: AngularFirestore) { 
    moment().locale('id')
    this.tanggalhariini = moment().format("DD/MM/yyyy")
    console.log(this.tanggalhariini)
  }

  ngOnInit() {
    this.getTransaksiHariIni();
  }

  getTransaksiHariIni()
  {
    this.db.collection(`Transaksi`, ref => ref.where('tanggal', '==', `${this.tanggalhariini}`).orderBy('timestamp','desc'))
      .valueChanges({idField: 'TransaksiID'}).pipe(take(1))
      .subscribe((data:any) => {
          this.allitem = data;
          console.log(this.allitem)
      });
  }

  async toDetail(item: any)
  {
    let modal = await this.modalCtrl.create({
      component: DetailtransaksihariiniPage,
      componentProps: {
        item: item,
      },
      cssClass: 'cart-modal'
    });
    modal.present();
  }


  close(){
    this.modalCtrl.dismiss();
  }

}
