import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import EscPosEncoder from '@mineminemine/esc-pos-encoder-ionic';
import {registerLocaleData, formatNumber} from '@angular/common';

@Component({
  selector: 'app-detailtransaksihariini',
  templateUrl: './detailtransaksihariini.page.html',
  styleUrls: ['./detailtransaksihariini.page.scss'],
})
export class DetailtransaksihariiniPage implements OnInit {
  item: any;
  detailitem: any;
  MAC_ADDRESS:any;
  diskon:any;
  PPN: any;
  constructor(private bluetoothSerial: BluetoothSerial, private db: AngularFirestore, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.MAC_ADDRESS = "0F:02:18:71:89:08";

    console.log(this.item)
    this.db.collection(`Transaksi/${this.item.InvoiceID}/Item`)
    .valueChanges({idField: 'MenuID'})
    .subscribe((data:any) => {
        this.detailitem = data;
        console.log(this.detailitem)
    });
  }

  getDisc()
  {
    
    this.db.collection(`Diskon`)
        .valueChanges()
        .subscribe((data:any) => {
            this.diskon = data[0].diskon;
            console.log('Diskon: '+this.diskon)
            // return of(this.tmptype);
        }
        
    );
  }

  getPPN()
  {
    
    this.db.collection(`PPN`)
        .valueChanges()
        .subscribe((data:any) => {
            this.PPN = data[0].PPN;
            console.log('PPN: '+this.PPN)
            // return of(this.tmptype);
        }
        
    );
  }


  printNota(){
    const encoder = new EscPosEncoder();
    const result = encoder.initialize();
    // this.img = new Image();
    // this.img.src = "../assets/LOGO DESSERTIE.png";
    const tanggal = moment().format("DD/MM/YYYY");
    const waktu = moment().format("HH:mm:ss");
    const invoiceID = this.item.invoiceID;
    function alignLeftRight(left:any, right:any) {
      console.log("left: " + left)
      console.log("right: " + right)

      let lineWidth = 29;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan) + "Rp "+right;
    }

    function alightLeftRightItem(left:any, right:any){
      let lineWidth = 27;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan)+ right;
    }

    function alignLeftRightBayar(left:any, right:any){
      let lineWidth = 29;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan)+"Rp "+ right;
    }

    function alignLeftRightKembalian(left:any, right:any){
      let lineWidth = 29;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan)+"Rp "+ right;
    }
    
    function alignLeftRightPPN(left:any, right:any){
      let lineWidth = 29;
      let space = " ";
      console.log("kiri: ",left.length);
      console.log("kanan: ", right.length);
      let pengurangan = lineWidth-left.length-right.length;
      console.log("pengurangan: ", pengurangan);
      return left + space.repeat(pengurangan)+"Rp "+ right;
    }


 
    result
    
      .codepage('windows1250')
      .align('center')
      // .image(this.img, 240, 240, 'threshold')
      .line("DESSERTIE")
      .line("Jl. Jenderal Sudirman")
      .newline()
      .line("================================")
      .align('left')
      .text("Invoice ID: ")
      .text(this.item.InvoiceID)
      .newline()
      .text("Tanggal   : ")
      .text(this.item.tanggal)
      .newline()
      .text("Waktu     : ")
      .text(this.item.waktu)
      .newline()
      .line("================================")
      .align('left')
      for(let i=0; i<this.detailitem.length; i++)
      {
        result
        .line(this.detailitem[i].amount + "x  " + this.detailitem[i].nama)
        // .line("    @"+formatNumber(this.cart[i].harga, 'en-US')+"       " + formatNumber((this.cart[i].amount * this.cart[i].harga), 'en-US'))
        .line("    @"+ alightLeftRightItem(formatNumber(this.detailitem[i].harga, 'en-US'), formatNumber((this.detailitem[i].amount * this.detailitem[i].harga), 'en-US')))

      }
      result
      .newline()
      .line('Total Item: ' + this.item.jumlahitem)
      // .text('Total Belanja:        ')
      // .line("Rp " + formatNumber(this.grandtotal, 'en-US'))
      .line(alignLeftRight('Grand Total', formatNumber(this.item.grandtotal, 'en-US')))
      .line(alignLeftRightPPN(`Diskon ${this.diskon}%`, formatNumber(this.item.jumlahdisc, 'en-US')))
      .line(alignLeftRightPPN(`PPN ${this.PPN}%`, formatNumber(this.item.jumlahppn, 'en-US')))
      .line(alignLeftRight('Total Belanja', formatNumber(this.item.totalbelanja, 'en-US')))

      .line(alignLeftRightBayar('Bayar', formatNumber(parseInt(this.item.jumlahbayar), 'en-US')))
      .line(alignLeftRightKembalian('Kembalian', formatNumber(this.item.kembalian, 'en-US')))
      .newline()
      .line("================================")
      .newline()
      .newline()
      .cut();

    const resultByte = result.encode();

    // send byte code into the printer
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

  close()
  {
    this.modalCtrl.dismiss();
  }

}
