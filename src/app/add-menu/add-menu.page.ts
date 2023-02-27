import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.page.html',
  styleUrls: ['./add-menu.page.scss'],
})
export class AddMenuPage implements OnInit {
  credentials!: FormGroup;
  submitted = false;
  tmpdata: any;
  tmpnama:any;
  tmpharga:any;
  constructor(private cartService: CartService,private dataService: DataService, private modalCtrl: ModalController, private fb: FormBuilder, private loadingController:LoadingController, private alertController:AlertController, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.credentials = this.fb.group({
			nama: ['', [Validators.required]],
			harga: ['', [Validators.required]]
		});
  }

  get nama(){
    return this.credentials.get('nama');
  }

  get harga(){
    return this.credentials.get('harga');
  }

  async saveItem()
  {
    console.log("masuk sini")
    this.submitted = true;
    this.tmpdata = [
      {nama: this.credentials.value.nama,
      harga: this.credentials.value.harga
      }
    ];

    console.log(this.tmpdata)
    await this.dataService.addMenu(this.tmpdata).then(()=>{
      this.cartService.clearCart();
    });
    // this.loadData();
    this.dataService.getData();
  }

  close()
  {
    this.modalCtrl.dismiss();
  }


}
