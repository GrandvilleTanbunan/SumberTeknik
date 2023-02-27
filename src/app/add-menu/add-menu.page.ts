import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.page.html',
  styleUrls: ['./add-menu.page.scss'],
})
export class AddMenuPage implements OnInit {
  credentials!: FormGroup;
  submitted = false;
  constructor(private modalCtrl: ModalController, private fb: FormBuilder, private loadingController:LoadingController, private alertController:AlertController, private authService: AuthService, private router: Router) { }

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

  saveItem()
  {
    this.submitted = true;
  }

  close()
  {
    this.modalCtrl.dismiss();
  }


}
