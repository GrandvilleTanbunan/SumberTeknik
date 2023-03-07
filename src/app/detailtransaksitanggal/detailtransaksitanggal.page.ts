import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DetailSeluruhPesananPage } from '../detail-seluruh-pesanan/detail-seluruh-pesanan.page';
import * as moment from 'moment';

@Component({
  selector: 'app-detailtransaksitanggal',
  templateUrl: './detailtransaksitanggal.page.html',
  styleUrls: ['./detailtransaksitanggal.page.scss'],
})
export class DetailtransaksitanggalPage implements OnInit {
  item: any;
  itempadatanggal: any;
  allitem: any;
  selectedtimeline: any;
  tahunini: any;
  title: any;
  constructor(private modalCtrl: ModalController, private db: AngularFirestore) { 
    moment.locale('id');
    this.tahunini = moment().format('YYYY');
  } 
  ngOnInit() {
    console.log("ini di modal: " , this.item);
    console.log("ini di modal: " , this.selectedtimeline);

    if(this.selectedtimeline == "Bulan Ini")
    {
      this.title = this.item.tanggal;
      this.db.collection(`Transaksi`, ref => ref.where('tanggal', '==', `${this.item.tanggal}`))
      .valueChanges({idField: 'MenuID'})
      .subscribe((data:any) => {
          this.allitem = data;
          console.log(this.allitem)
      });
    }

    if(this.selectedtimeline == "Tahun Ini")
    {
      this.title = moment(this.item.tanggal, 'MM/YYYY').format("MMMM YYYY");
      console.log(this.title)
      this.db.collection(`Transaksi`, ref => ref.where('bulan', '==', `${moment(this.item.tanggal, 'MM/YYYY').format("MM")}`))
      .valueChanges({idField: 'MenuID'})
      .subscribe((data:any) => {
          this.allitem = data;
          console.log(this.allitem)
      });
    }
    
  }

  async pilihtransaksi(item: any)
  {
    // console.log(item)
    let modal = await this.modalCtrl.create({
      component: DetailSeluruhPesananPage,
      componentProps: {
        item: item,
      },
      cssClass: 'cart-modal'
    });
    modal.present();
  }

  close()
  {
    this.modalCtrl.dismiss();
  }




}
