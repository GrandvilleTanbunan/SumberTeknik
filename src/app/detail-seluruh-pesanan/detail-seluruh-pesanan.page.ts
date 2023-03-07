import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-seluruh-pesanan',
  templateUrl: './detail-seluruh-pesanan.page.html',
  styleUrls: ['./detail-seluruh-pesanan.page.scss'],
})
export class DetailSeluruhPesananPage implements OnInit {
  item: any;
  detailitem: any[] = [];
  waktu: any;
  constructor(private modalCtrl: ModalController, private db: AngularFirestore) { }

  ngOnInit() {
    console.log(this.item)
    this.convertwaktu();
    this.db.collection(`Transaksi/${this.item.InvoiceID}/Item`)
    .valueChanges({idField: 'MenuID'})
    .subscribe((data:any) => {
        this.detailitem = data;
        console.log(this.detailitem)
    });
  }
  
  convertwaktu()
  {
    this.waktu = moment(this.item.waktu, 'hh.mm.ss').format('HH:mm')
  }

  close()
  {
    this.modalCtrl.dismiss();
  }

}
