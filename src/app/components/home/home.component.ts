import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DarkService } from 'src/app/services/dark.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  darkmode: boolean;
  private darkModeSub: Subscription;

  constructor(private darkService: DarkService) { }

  ngOnInit(): void {
    this.darkModeSub = this.darkService.getDarkModeListener().subscribe(dark => {
      this.darkmode = dark;
    });
    if(localStorage.getItem('darkmode') === 'true') this.darkmode = true;
  }
  
 ngOnDestroy(): void {
   this.darkModeSub.unsubscribe();
 }

}
