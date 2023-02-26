import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  listData = [];
  tmpdata: any;
  tmpnama:any;
  tmpharga:any;
  tmpjumlah:any;
  constructor(private dataService: DataService) {
    this.loadData();
  }

  async loadData()
  {
    // this.listData = await this.dataService.getData();
    this.dataService.getData().subscribe((res: any)=>{
      this.listData = res;
    })
    console.log(this.listData);
  }

  async addData()
  {
    this.tmpdata = [
      {nama: this.tmpnama,
      harga: this.tmpharga,
      jumlah: this.tmpjumlah}
    ];
    await this.dataService.addData(this.tmpdata);

    this.loadData();
  }

  async removeItem(index: any)
  {
    this.dataService.removeItem(index);
    this.listData.splice(index, 1);
  }

}
