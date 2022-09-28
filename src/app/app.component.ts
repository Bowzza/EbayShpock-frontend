import { trigger, transition, query, style, group, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DarkService } from './services/dark.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private authService: AuthService, private darkService: DarkService) {}

  ngOnInit(): void {
    this.authService.autoAuthUser();
    if(localStorage.getItem('darkmode') === 'true') {
      document.body.style.background = '#000';
    }

    this.darkService.getDarkModeListener().subscribe(dark => {
      if(dark) document.body.style.background = '#000';
      if(!dark) document.body.style.background = 'rgba(39, 174, 96, 0.1)';
    });
  }

}
