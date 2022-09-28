import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DarkService } from 'src/app/services/dark.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  registerSubmit: boolean = false;
  errMessage: string;
  loadingAuth: boolean;
  private errorMessageRegisterListenerSub: Subscription;
  private loadingListenerSub: Subscription;
  darkmode: boolean;
  private darkModeSub: Subscription;


  constructor(private authService: AuthService, private darkService: DarkService) { 
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConfirm: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadingListenerSub = this.authService.getLoadingListener().subscribe(isLoading => {
      this.loadingAuth = isLoading;
    });
    this.errorMessageRegisterListenerSub = this.authService.getErrorMessageListener().subscribe(err => {
      this.errMessage = err;
    });
    this.darkModeSub = this.darkService.getDarkModeListener().subscribe(res => {
      this.darkmode = res;
    });
    if(localStorage.getItem('darkmode') === 'true') this.darkmode = true;
  }

  ngOnDestroy(): void {
    this.errorMessageRegisterListenerSub.unsubscribe();
    this.loadingListenerSub.unsubscribe();
    this.darkModeSub.unsubscribe();
  }

  registerFormSubmit(): void {
    this.registerSubmit = true;
    this.loadingAuth = true;
    if(this.registerForm.invalid || this.password.value !== this.passwordConfirm.value) {
      this.loadingAuth = false;
      return;
    }
    this.authService.registerUser(this.email.value, this.password.value);
    console.log('Dere');
    this.registerSubmit = false;
  }

  get email(): any {
    return this.registerForm.get('email');
  }

  get password(): any {
    return this.registerForm.get('password');
  }

  get passwordConfirm(): any {
    return this.registerForm.get('passwordConfirm');
  }



}
