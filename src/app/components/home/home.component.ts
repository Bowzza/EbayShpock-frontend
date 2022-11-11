import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  searchTerm: string

  constructor(private darkService: DarkService, private router: Router) { }

  ngOnInit(): void {
    this.darkModeSub = this.darkService.getDarkModeListener().subscribe(dark => {
      this.darkmode = dark;
    });
    if(localStorage.getItem('darkmode') === 'true') this.darkmode = true;
  }
  
 ngOnDestroy(): void {
   this.darkModeSub.unsubscribe();
 }

 search(): void {
  if(this.searchTerm.length === 0 || this.searchTerm === '') return;
  // alert('Geht');
  this.router.navigate(['searchResults'], { queryParams: { search_query: this.searchTerm } });
 }

}
