import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { SwPush } from '@angular/service-worker';
import { NotifyService } from 'src/app/services/notify.service';
import { Subscription } from 'rxjs';
import { DarkService } from 'src/app/services/dark.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  animations: [
    trigger('fadeIn',  [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1}),
        animate('250ms', style({ opacity: 0, transform: 'scale(0.6)' }))
      ])
    ])
  ]
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlist: Array<Product> = [];
  notifyProducts: Array<Product> = [];
  loadingProducts: boolean;
  notifyStatus: boolean;
  darkmode: boolean;
  private darkModeSub: Subscription;
  private publicKey = 'BAy2VcQF71uSawjegbi4VE5umZTswgCqR0wuo1sTkTIEatyTBYEhaUWk8jE5Hkllvfy1wiIHW6Q1RfnJGTdY09M';

  constructor(private authService: AuthService, private productsService: ProductsService, 
    private notifyService: NotifyService, private darkService: DarkService, private swPush: SwPush) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.loadingProducts = true;
    this.notifyService.getNotifyStatus().subscribe(res => {
      this.notifyStatus = res;
      if(this.notifyStatus) document.getElementById('flexSwitchCheckDefault')?.setAttribute('checked', 'false');
      this.loadingProducts = false;
    });

    this.productsService.getProducts().subscribe(res => {
      this.wishlist = res;
      this.sortByPrice(this.wishlist);
      this.notifyService.getNotifyProducts().subscribe(res => {
        this.notifyProducts = res;
        this.wishlist.forEach(w => {
          this.notifyProducts.forEach(n => {
            if(w._id === n._id) w.notify = true;
          });
        });
        this.loadingProducts = false;
      });
    });

    this.darkModeSub = this.darkService.getDarkModeListener().subscribe(res => {
      this.darkmode = res;
    });
    if(localStorage.getItem('darkmode') === 'true') this.darkmode = true;
  }

  ngOnDestroy(): void {
    this.darkModeSub.unsubscribe();
  }

  removeProduct(product: Product) {
    this.productsService.addProductFrontend(-1);
    this.wishlist = this.wishlist.filter(el => el._id !== product._id);
    this.productsService.removeProduct(product.articleNumber).subscribe();
  }

  sortByPrice(arr: Array<any>) {
    arr.sort((a: any, b: any) => {
      return a.price - b.price;
    });
  }

  pushSubscription(): void {
    if (!this.swPush.isEnabled) {
      return;
    }
    this.swPush.requestSubscription({
      serverPublicKey: this.publicKey
    })
    .then(sub => {
      localStorage.setItem('sub', JSON.stringify(sub));
      this.notifyService.addingSub(sub).subscribe(res => console.log(res))
    })
    .catch(err => console.log(err));
  }

  addingProductToNotify(product: Product) {
    product.notify = true;
    this.notifyService.addProductToNotifyList(product).subscribe();
  }

  removeProductFromNotify(product: Product) {
    product.notify = false;
    this.notifyService.removeProductFromNotifyList(product._id).subscribe();
  }

  switchNotifyStatus() {
    this.notifyStatus = !this.notifyStatus;
    if(this.notifyStatus) {
      this.pushSubscription();
    } else {
      localStorage.removeItem('sub');
    }
    this.notifyService.postNotifyStatus().subscribe();
  }

  testNotification() {
    this.notifyService.testNotification().subscribe(res => {
      alert(res.message);
    }, err => {
      alert(err.error.message);
    });
  }

}
