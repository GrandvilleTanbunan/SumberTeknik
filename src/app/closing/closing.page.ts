import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { DetailtransaksihariiniPageModule } from '../detailtransaksihariini/detailtransaksihariini.module';
import { DetailtransaksihariiniPage } from '../detailtransaksihariini/detailtransaksihariini.page';
import EscPosEncoder from '@mineminemine/esc-pos-encoder-ionic';
import {registerLocaleData, formatNumber} from '@angular/common';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';

@Component({
  selector: 'app-closing',
  templateUrl: './closing.page.html',
  styleUrls: ['./closing.page.scss'],
})
export class ClosingPage implements OnInit {
  tanggalhariini: any;
  allitem: any;
  detailitem: any[] = [];
  tmpitem: any[] = [];
  totalamount: any;
  MAC_ADDRESS: any;
  grandtotal: any;
  bluetoothconnected = false;

  constructor(private modalCtrl:ModalController, private bluetoothSerial: BluetoothSerial, private db: AngularFirestore, private toastController: ToastController) { 
    let encoder = new EscPosEncoder();
    this.MAC_ADDRESS = "0F:02:18:71:89:08";

    moment().locale('id')
    this.tanggalhariini = moment().format("DD/MM/yyyy")
    console.log(this.tanggalhariini)
  }

  ngOnInit() {
    this.MAC_ADDRESS = "0F:02:18:71:89:08";
    this.getTransaksiHariIni();
  }

  connectBluetooth()
  {
    this.MAC_ADDRESS = "0F:02:18:71:89:08";
    // send byte code into the printer
    this.bluetoothSerial.connect(this.MAC_ADDRESS).subscribe(async (success: any) => {
      const toast = await this.toastController.create({
        message: 'Printer Connected!',
        duration: 1000,
        position: 'top'
      });
      await toast.present()
      this.bluetoothconnected = true;

    },(error:any) => {
        console.log("Connection Error " +  error);
        this.bluetoothconnected = false;

      });

  }

  getTransaksiHariIni()
  {
    this.db.collection(`Transaksi`, ref => ref.where('tanggal', '==', `${this.tanggalhariini}`).orderBy('timestamp','desc'))
      .valueChanges({idField: 'TransaksiID'}).pipe(take(1))
      .subscribe((data:any) => {
          this.allitem = data;
          console.log(this.allitem)
          this.rangkuman();

      });
  }

  rangkuman()
  {
    let completedCount = 0;
    this.detailitem = [];
    // console.log(this.allitem)
    for(let i=0; i<this.allitem.length; i++)
    {
      this.db.collection(`Transaksi/${this.allitem[i].InvoiceID}/Item`)
      .valueChanges({idField: 'ID'})
      .subscribe((data:any) => {
          completedCount ++;
          this.detailitem.push(data);
          if(completedCount == this.allitem.length)
          {
            this.hitungitem();
          }
      });
    }
    
  }

  hitungitem()
  {
    let kembar = false;
    let idxi = 0;
    let idxj = 0;
    let idxz = 0;
    this.tmpitem = [];
    for(let i=0; i<this.detailitem.length; i++)
    {
      for(let j=0; j<this.detailitem[i].length; j++)
      {
        for(let z=0; z<this.tmpitem.length; z++)
        {
          if(this.tmpitem[z].nama == this.detailitem[i][j].nama)
          {
            kembar = true;
            idxz = z;
          }
        }
        if(kembar == false)
        {
          this.tmpitem.push({nama: this.detailitem[i][j].nama, amount: this.detailitem[i][j].amount, harga: this.detailitem[i][j].harga, grandtotal: parseInt(this.detailitem[i][j].harga) * parseInt(this.detailitem[i][j].amount)})
        }
        else if(kembar == true)
        {
          this.tmpitem[idxz].amount = parseInt(this.tmpitem[idxz].amount) + parseInt(this.detailitem[i][j].amount);
          this.tmpitem[idxz].grandtotal = parseInt(this.tmpitem[idxz].amount) * parseInt(this.tmpitem[idxz].harga);
          kembar = false;

        }
      }
    }
    console.log(this.tmpitem);
    this.hitungjumlahitem();

    // this.printClosing();
    

  }

  printClosing()
  {
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();
    // this.img = new Image();
    // this.img.src = "../assets/LOGO DESSERTIE.png";
    const tanggal = moment().format("DD/MM/YYYY");
    const waktu = moment().format("HH:mm:ss");
    // const invoiceID = this.invoicenumber;
    function alignLeftRight(left:any, right:any) {
      let lineWidth = 29;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan) + "Rp "+right;
    }

    result
    
      .codepage('windows1250')
      .align('center')
      // .image(this.img, 240, 240, 'threshold')
      .line("DESSERTIE")
      .line("CLOSING")
      .line("================================")
      .align('left')
      .text("Tanggal      : ")
      .text(tanggal)
      .newline()
      .text("Waktu Closing: ")
      .text(waktu)
      .newline()
      .line("================================")
      .align('left')
      for(let i=0; i<this.tmpitem.length; i++)
      {
        result
        .line(this.tmpitem[i].nama)
        // .line("    @"+formatNumber(this.cart[i].harga, 'en-US')+"       " + formatNumber((this.cart[i].amount * this.cart[i].harga), 'en-US'))
        .line(this.tmpitem[i].amount + " x " + formatNumber(this.tmpitem[i].harga, 'en-US') +" = " + formatNumber(this.tmpitem[i].grandtotal, 'en-US'))

      }
      result
      .newline()
      .line('Total Item: ' + this.totalamount)
      .line(alignLeftRight('Grand Total', formatNumber(this.grandtotal, 'en-US')))
      .newline()
      .line("================================")
      .newline()
      .newline()
      .cut();

    const resultByte = result.encode();
    this.bluetoothSerial.connect(this.MAC_ADDRESS).subscribe(() => {
      this.bluetoothSerial.write(resultByte)
        .then(async () => {
          this.bluetoothSerial.clear();
          this.bluetoothSerial.disconnect();
          console.log('Print success');
        })
        .catch((err) => {
          console.error(err);
        });
    });

  }

  hitungjumlahitem()
  {
    this.totalamount = 0;
    this.grandtotal = 0;

    console.log(this.tmpitem)
    for(let i=0; i<this.tmpitem.length; i++)
    {
      this.totalamount = this.totalamount + this.tmpitem[i].amount;
      this.grandtotal = parseInt(this.grandtotal) + parseInt(this.tmpitem[i].grandtotal);
    }
    console.log(this.grandtotal)
  }


  close()
  {
    this.modalCtrl.dismiss();
  }

}
