import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { subscribeOn, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DarkService } from 'src/app/services/dark.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private errorMessageListenerSub: Subscription;
  private loadingListenerSub: Subscription;
  errorMessage: string = '';
  loadingAuth: boolean;
  darkmode: boolean;
  private darkModeSub: Subscription;


  constructor(private authService: AuthService, private darkService: DarkService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
   }

  ngOnInit(): void {
    this.loadingListenerSub = this.authService.getLoadingListener().subscribe(isLoading => {
      this.loadingAuth = isLoading;
    });
    this.errorMessageListenerSub = this.authService.getErrorMessageListener().subscribe(err => {
      this.errorMessage = err;
    });
    this.darkModeSub = this.darkService.getDarkModeListener().subscribe(res => {
      this.darkmode = res;
    });
    if(localStorage.getItem('darkmode') === 'true') this.darkmode = true;
  }

  ngOnDestroy(): void {
    this.errorMessageListenerSub.unsubscribe();
    this.loadingListenerSub.unsubscribe();
    this.darkModeSub.unsubscribe();
  }

  loginFormSubmit(): void {
    if(this.loginForm.invalid) return;
    this.loadingAuth = true;
    this.authService.loginUser(this.email.value, this.password.value);
  }

  get email(): any {
    return this.loginForm.get('email');
  }

  get password(): any {
    return this.loginForm.get('password');
  }
}
