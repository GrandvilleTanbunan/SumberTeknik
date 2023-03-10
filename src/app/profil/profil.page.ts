import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  constructor(private cartService:CartService,private authService: AuthService, private fb: FormBuilder, private loadingController:LoadingController, private alertController:AlertController, private router: Router) { }

  ngOnInit() {
  }

  logout()
  {
    this.authService.logout().then(()=>{
      this.cartService.clearCart();
      this.router.navigateByUrl("/", {replaceUrl: true});
    });
  }

}
