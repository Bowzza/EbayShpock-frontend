import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() darkmode: boolean;
  @Output() filterEbay: EventEmitter<any> = new EventEmitter();
  @Output() filterShpock: EventEmitter<any> = new EventEmitter();
  @Output() sortByPrice: EventEmitter<any> = new EventEmitter();
  @Output() removeFilter: EventEmitter<any> = new EventEmitter();

  filterEbaySub: Subscription
  filteringEbay: boolean;

  filterShpockSub: Subscription
  filteringShpock: boolean;

  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
    this.filterEbaySub = this.filterService.getEbayFilterListener().subscribe(value => this.filteringEbay = value);
    this.filterShpockSub = this.filterService.getShpockFilterListener().subscribe(value => this.filteringShpock = value);
  }

  filterEbayProducts() {
    this.filterEbay.emit();
  }

  filterShpockProducts() {
    this.filterShpock.emit();
  }

  sortProductsByPrice(event: any) {
    this.sortByPrice.emit(event);
  }

  removeProductsFilter() {
    this.removeFilter.emit();
  }

  ngOnDestroy(): void {
    this.filterEbaySub.unsubscribe();
    this.filterShpockSub.unsubscribe();
  }

}
