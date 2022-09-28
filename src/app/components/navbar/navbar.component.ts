import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DarkService } from 'src/app/services/dark.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  isAuth: boolean = false;
  darkmode: boolean;
  language: string;

  constructor(private authService: AuthService, private darkService: DarkService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuth = isAuth;
    });

    this.darkService.getDarkModeListener().subscribe(dark => {
      this.darkmode = dark;
    });

    if(localStorage.getItem('darkmode') === 'true') this.darkmode = true;
    if(this.darkmode) document.getElementById('switchTheme')?.setAttribute('checked', 'false');
    const string  = window.location.href.split('/');
    this.language = string[3];
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleDarkMode() {
    if(!localStorage.getItem('darkmode')) {
      localStorage.setItem('darkmode', JSON.stringify(true));
      document.body.style.background = '#000';
      this.darkService.emitValue(true);
    } else {
      const value = JSON.parse(localStorage.getItem('darkmode') || 'false');
      localStorage.setItem('darkmode', JSON.stringify(!value));
      // if(value) document.getElementById('flexSwitchCheckDefault')?.setAttribute('checked', 'true');
      // if(!value) document.getElementById('flexSwitchCheckDefault')?.setAttribute('checked', 'false');
      this.darkService.emitValue(!value);
    }
  }

      
  changeLanguage(event: any): void {
    if(event.target.value === 'de') {
      window.location.href = window.location.href.replace('en-US', 'de-AT');
    } else if (event.target.value === 'en') {
      window.location.href = window.location.href.replace('de-AT', 'en-US');
    }
  }
}
