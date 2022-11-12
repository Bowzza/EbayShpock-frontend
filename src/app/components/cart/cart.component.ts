import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  productsInWishlist: number;
  private getProductsListenerSubs: Subscription;
  private addProductFrontendListener: Subscription;

  constructor(private productService: ProductsService) { }


  ngOnInit(): void {

    this.getProductsListenerSubs = this.productService.getProducts().subscribe(products =>{
      this.productsInWishlist = products.length;
    });

    this.addProductFrontendListener = this.productService.getAddProductFrontendListener()
      .subscribe((value: number) => {
        this.productsInWishlist += value;
        this.changeAnimationOfCart('cartAnimation .3s');
        setTimeout(() => {
          this.changeAnimationOfCart('none');
        }, 300);
      })
  }

  changeAnimationOfCart(animation: string) {
    const carts = Array.from(document.querySelectorAll(".itemsInCart") as unknown as HTMLCollectionOf<HTMLElement>);
    carts.forEach((cart) => {
      cart.style.animation = animation;
    });
  }

  ngOnDestroy(): void {
    this.getProductsListenerSubs.unsubscribe();
    this.addProductFrontendListener.unsubscribe();
  }

}
