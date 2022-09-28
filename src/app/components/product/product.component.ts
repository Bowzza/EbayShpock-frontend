import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product';
import { AuthService } from 'src/app/services/auth.service';
import { DarkService } from 'src/app/services/dark.service';
import {MatDialog} from '@angular/material/dialog';
import { ProductInfoDialogComponent } from '../product-info-dialog/product-info-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  @Input() product: Product;
  @Input() showBell?: boolean;
  @Output() addingProduct: EventEmitter<any> = new EventEmitter();
  @Output() removingProduct: EventEmitter<any> = new EventEmitter();
  @Output() addingProductToNotify: EventEmitter<any> = new EventEmitter();
  @Output() removingProductFromNotify: EventEmitter<any> = new EventEmitter();
  private authListenerSubs: Subscription;
  isAuth: boolean = false;
  darkmode: boolean;
  private darkModeSub: Subscription;
  dialogRef: any;

  constructor(private authService: AuthService, private darkService: DarkService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuth = isAuth;
    });
    this.darkModeSub = this.darkService.getDarkModeListener().subscribe(dark => {
      this.darkmode = dark;
    });
    if(localStorage.getItem('darkmode') === 'true') this.darkmode = true;
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.darkModeSub.unsubscribe();
  }

  addProduct(product: Product) {
    this.addingProduct.emit(product);
  }

  removeProduct(id: string) {
    this.removingProduct.emit(id);
  }

  addProductToNotify(product: Product) {
    this.addingProductToNotify.emit(product);
  }

  removeProductFromNotify(product: Product) {
    this.removingProductFromNotify.emit(product);
  }

  openProductInfo(product: Product): void {
    this.dialogRef = this.dialog.open(ProductInfoDialogComponent, {
      data: {product, darkmode: this.darkmode}
    });
  }
}
