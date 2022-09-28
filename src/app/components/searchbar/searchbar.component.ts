import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

  searchForm: FormGroup
  @Output() searchProduct: EventEmitter<string> = new EventEmitter();

  constructor() { 
    this.searchForm = new FormGroup({
      searchTerm: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  get searchTermField(): any {
    return this.searchForm.get('searchTerm');
  }

  search() {
    if(this.searchForm.invalid) return;
    this.searchProduct.emit(this.searchTermField.value);
  }

}
