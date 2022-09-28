import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-product-info-dialog',
  templateUrl: './product-info-dialog.component.html',
  styleUrls: ['./product-info-dialog.component.scss']
})
export class ProductInfoDialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: {product: Product, darkmode: boolean}) { }

  ngOnInit(): void {
    if(this.data.darkmode) {
      const dialog = document.querySelector('.mat-dialog-container');
      dialog?.classList.add('darkmode');
    } else {
      const dialog = document.querySelector('.mat-dialog-container');
      dialog?.classList.remove('darkmode');
    }
    
  }

}
