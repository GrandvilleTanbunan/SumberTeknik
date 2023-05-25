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
  detailitem: any[] = [];
  tmpitem: any[] = [];
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

  cetakClosingan()
  {
    this.detailitem = [];
    console.log(this.allitem)
    for(let i=0; i<this.allitem.length; i++)
    {
      this.db.collection(`Transaksi/${this.allitem[i].InvoiceID}/Item`)
      .valueChanges({idField: 'ID'})
      .subscribe((data:any) => {
          this.detailitem.push(data);
          console.log(this.detailitem)
          this.hitungitem();
      });
    }
    
  }

  hitungitem()
  {
    let kembar = false;
    let idxi = 0;
    let idxj = 0;
    let idxz = 0;
    for(let i=0; i<this.detailitem.length; i++)
    {
      for(let j=0; j<this.detailitem[i].length; j++)
      {
        for(let z=0; z<this.tmpitem.length; z++)
        {
          if(this.tmpitem[z].nama == this.detailitem[i][j].nama)
          {
            kembar = true;
            idxi = i;
            idxj = j;
            idxz = z;

          }
        }
      }
    }
    console.log(kembar)

    if(kembar == false)
    {
      this.tmpitem.push({nama: this.detailitem[idxi][idxj].nama, amount: this.detailitem[idxi][idxj].amount})
      console.log(this.tmpitem);
    }

  }


  close(){
    this.modalCtrl.dismiss();
  }

}
