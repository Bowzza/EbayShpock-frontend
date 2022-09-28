import { trigger, transition, style, animate } from '@angular/animations';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { indicate, IndicatorBehaviorSubject } from 'ngx-ready-set-go';
import { catchError, last, map, Subscription, tap } from 'rxjs';
import { Product } from 'src/app/model/product';
import { DarkService } from 'src/app/services/dark.service';
import { FilterService } from 'src/app/services/filter.service';
import { ProductsService } from 'src/app/services/products.service';
import { SearchService } from 'src/app/services/search.service';



@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  animations: [
    trigger('fadeIn',  [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class SearchResultsComponent implements OnInit, OnDestroy {

  searchedTerm: string | null;
  searchResults: Product[] = [];
  wishlist: Product[] = [];
  beforeFilterResults: Product[] = [];
  loadingProducts: boolean;
  filteringEbay: boolean;
  filteringShpock: boolean;
  asc: boolean;
  desc: boolean;
  darkmode: boolean;
  dialogRef: any;
  private darkModeSub: Subscription;


  constructor(private searchService: SearchService, private productsService: ProductsService, private router: Router, private route: ActivatedRoute,
    private darkService: DarkService, private filterService: FilterService) {
    
   }

  ngOnInit(): void {
    if(localStorage.getItem('token')) {
      this.productsService.getProducts().subscribe(res => {
        this.wishlist = res;
      });
    }

    this.darkModeSub = this.darkService.getDarkModeListener().subscribe(dark => {
      this.darkmode = dark;
      this.changeThemeOfFilterModal(this.darkmode);
    });
    if(localStorage.getItem('darkmode') === 'true') {
      this.darkmode = true;
      this.changeThemeOfFilterModal(this.darkmode);
    } else {

    }

    this.searchedTerm = this.route.snapshot.queryParamMap.get('search_query');
    if(this.searchedTerm == null || this.searchedTerm === '') return;
    this.searchService.search(this.searchedTerm).subscribe(res => {
      this.searchResults = res;
      // this.removeDoubleProducts(this.searchResults);
      this.beforeFilterResults = res;
      // this.searchResults.shift();
      this.checkIfInList();
      this.sortByPriceAsc(this.searchResults);
    });


  }

  ngOnDestroy(): void {
   this.darkModeSub.unsubscribe();
  }

  search(searchTerm: string) {
    if(localStorage.getItem('token')) {
      this.productsService.getProducts().subscribe(res => {
        this.wishlist = res;
      });
    }
    this.searchedTerm = this.route.snapshot.queryParamMap.get('search_query');
    this.router.navigate(['searchResults'], { queryParams: { search_query: searchTerm } });
    this.searchService.search(searchTerm).subscribe(res => {
      this.searchedTerm = searchTerm;
      this.searchResults = res;
      // this.removeDoubleProducts(this.searchResults);
      this.beforeFilterResults = this.searchResults;
      // this.searchResults.shift();
      this.checkIfInList();
      this.sortByPriceAsc(this.searchResults);
    });
  }

  checkIfInList() {
    this.wishlist.forEach(w => {
      this.searchResults.forEach(s => {
        if(w.articleNumber == s.articleNumber) { s.inWishlist = true; }
      });
    });
  }



  addProduct(product: Product) {
    product.inWishlist = true;
    this.productsService.addProduct(product).subscribe(_res => {
      // console.log(res);
    }, _err => {
      // console.log(err);
    });
  }

  removeProduct(product: Product) {
    this.wishlist = this.wishlist.filter(el => el._id !== product._id);
    product.inWishlist = false;
    this.productsService.removeProduct(product.articleNumber).subscribe(_res => {
      // console.log(res);
    }, _err => {
      // console.log(err);
    });
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  sortByPriceAsc(arr: Array<any>) {
    arr.sort((a: any, b: any) => {
      return a.price - b.price;
    });
  }

  sortByPriceDesc(arr: Array<any>) {
    arr.sort((a: any, b: any) => {
      return b.price - a.price;
    });
  }

  sortByPrice(event: any) {
    if(event.value === 'asc') {
      this.desc = false;
      this.asc = true;
      this.sortByPriceAsc(this.searchResults);
      return;
    }
    this.asc = false;
    this.desc = true;
    this.sortByPriceDesc(this.searchResults);
  }

  filterEbay() {
    this.filteringShpock = false;
    this.filteringEbay = true;
    this.filterService.changeEbayFilter(this.filteringEbay);
    this.filterService.changeShpockFilter(this.filteringShpock);
    this.searchResults = this.beforeFilterResults;
    this.searchResults = this.searchResults.filter(product => product.shop === 'Ebay');
    this.desc ? this.sortByPriceDesc(this.searchResults) : this.sortByPriceAsc(this.searchResults);
  }

  filterShpock() {
    this.filteringEbay = false;
    this.filteringShpock = true;
    this.filterService.changeEbayFilter(this.filteringEbay);
    this.filterService.changeShpockFilter(this.filteringShpock);
    this.searchResults = this.beforeFilterResults;
    this.searchResults = this.searchResults.filter(product => product.shop === 'Shpock');
    this.desc ? this.sortByPriceDesc(this.searchResults) : this.sortByPriceAsc(this.searchResults);
  }

  removeFilter() {
    this.filteringEbay = false;
    this.filteringShpock = false;
    this.filterService.changeEbayFilter(this.filteringEbay);
    this.filterService.changeShpockFilter(this.filteringShpock);
    this.searchResults = this.beforeFilterResults;
    if(this.desc) this.sortByPriceDesc(this.searchResults);
  }

  loadMoreProducts() {
    this.removeFilter();
    const searchName = this.route.snapshot.queryParamMap.get('search_query');
    const numbers = this.getNumberOfProducts();
    this.loadingProducts = true;
    this.searchService.loadMoreProducts(searchName, numbers.ebay, numbers.shpock).subscribe(res => {
      this.searchResults = this.searchResults.concat(res);
      // this.removeDoubleProducts(this.searchResults);
      this.beforeFilterResults = this.searchResults;
      this.sortByPriceAsc(this.searchResults);
      this.loadingProducts = false;
    }, err => {
      this.loadingProducts = false;
    });
  }

  getNumberOfProducts() {
    let ebay = 0;
    let shpock = 0;
    this.searchResults.forEach(product => {
      if(product.shop === 'Ebay') ebay++;
      if(product.shop === 'Shpock') shpock++;
    });
    console.log(ebay+' '+shpock);
    return {
      ebay,
      shpock
    }
  }

  

  removeDoubleProducts(firstArr: Product[]) {
    firstArr.forEach((firstProduct, index) => {
      firstArr.forEach((secondProduct, i) => {
        if(firstProduct.articleNumber === secondProduct.articleNumber && index !== i) {
          firstArr.splice(index, 1);
        }
      });
    })
  }

  changeThemeOfFilterModal(darkmode: boolean) {
    let filterModal = document.getElementById('filterModalContent');
    if(darkmode) {
      filterModal.style.backgroundColor = '#0A0A0B';
      filterModal.style.border = '1px solid #fff';
      filterModal.style.color = '#fff';
      return;
    }
    filterModal.style.backgroundColor = '#fff';
    filterModal.style.border = 'none';
    filterModal.style.color = '#000';
  }

}
