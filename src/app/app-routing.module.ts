import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {redirectUnauthorizedTo, redirectLoggedInTo, canActivate} from '@angular/fire/auth-guard'


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['tabs']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'cart-modal', 
    loadChildren: () => import('./pages/cart-modal/cart-modal.module').then( m => m.CartModalPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: '**',
    redirectTo:'',
    pathMatch:'full'
    
  },
  {
    path: 'add-menu',
    loadChildren: () => import('./add-menu/add-menu.module').then( m => m.AddMenuPageModule)
  },
  {
    path: 'edititem',
    loadChildren: () => import('./edititem/edititem.module').then( m => m.EdititemPageModule)
  },  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'detailtransaksitanggal',
    loadChildren: () => import('./detailtransaksitanggal/detailtransaksitanggal.module').then( m => m.DetailtransaksitanggalPageModule)
  },
  {
    path: 'detail-seluruh-pesanan',
    loadChildren: () => import('./detail-seluruh-pesanan/detail-seluruh-pesanan.module').then( m => m.DetailSeluruhPesananPageModule)
  },
  {
    path: 'add-user',
    loadChildren: () => import('./add-user/add-user.module').then( m => m.AddUserPageModule)
  },


  


  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
