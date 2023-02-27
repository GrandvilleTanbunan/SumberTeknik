import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { ModalController } from '@ionic/angular';
import { AddMenuPage } from '../add-menu/add-menu.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  listData: any = [];
  // tmpdata;
  tmpnama:any;
  tmpharga:any;
  tmpjumlah:any;
  constructor(private dataService: DataService, private modalCtrl: ModalController) {
    this.loadData();
  }

  public async loadData()
  {
    // this.listData = await this.dataService.getData();
    this.dataService.getData().subscribe((res: any)=>{
      this.listData = res;
      console.log(this.listData);

    });
  }

  async addData()
  {
    // this.tmpdata = [
    //   {nama: this.tmpnama,
    //   harga: this.tmpharga,
    //   jumlah: this.tmpjumlah}
    // ];
    // await this.dataService.addData(this.tmpdata);

    // this.loadData();

   
  }

  async openAddMenu()
  {
    let modal = await this.modalCtrl.create({
      component: AddMenuPage,
      // cssClass: 'cart-modal'
    });
    modal.present();
  }

  async removeItem(item: any)
  {
    // this.dataService.removeItem(index);
    // this.listData.splice(index, 1);

    console.log(item)
  }

}
