import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DarkService } from 'src/app/services/dark.service';

@Component({
  selector: 'app-accountinfo',
  templateUrl: './accountinfo.component.html',
  styleUrls: ['./accountinfo.component.scss']
})
export class AccountinfoComponent implements OnInit, OnDestroy {

  displayEmail: string

  errorEmailMessage: string
  successEmailMessage: string;
  errorPasswordMessage: string
  successPasswordMessage: string;

  changeEmailForm: FormGroup;
  changePasswordForm: FormGroup;

  loadingForm: boolean;
  submitted: boolean;

  passwordsNotSame: boolean;

  darkMode: boolean;
  darkServiceSubscription: Subscription

  constructor(private authService: AuthService, private darkService: DarkService) { 
    this.changeEmailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConfirmed: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit(): void {
    if(localStorage.getItem('email')) this.displayEmail = localStorage.getItem('email');

    this.darkServiceSubscription = this.darkService.getDarkModeListener().subscribe(mode => {
      this.darkMode = mode;
    });
    if(localStorage.getItem('darkmode') === 'true') this.darkMode = true;
  }

  changeEmailSubmit(): void {
    this.errorEmailMessage = '';
    this.successEmailMessage = '';
    this.submitted = true;
    this.loadingForm = true;
    if(this.changeEmailForm.invalid) return;
    this.authService.changeEmail(this.email.value).subscribe(res => {
      this.loadingForm = false;
      this.successEmailMessage = res.message;
      localStorage.setItem('email', this.email.value);
      this.displayEmail = this.email.value;
    }, err => {
      this.loadingForm = false;
      this.errorEmailMessage = err.error.message;
    });
  }

  changePasswordSubmit(): void {
    this.errorPasswordMessage = '';
    this.successPasswordMessage = '';
    this.passwordsNotSame = false;
    this.submitted = true;
    this.loadingForm = true;
    if(this.changePasswordForm.invalid) {
      this.loadingForm = false;
      return;
    }
    if(this.password.value !== this.passwordConfirmed.value) {
      this.passwordsNotSame = true;
      this.loadingForm = false;
      return;
    }
    this.authService.changePassword(this.password.value).subscribe(res => {
      this.loadingForm = false;
      this.successPasswordMessage = res.message;
    }, err => {
      this.loadingForm = false;
      this.errorPasswordMessage = err.error.message;
    });
  }

  get email(): any {
    return this.changeEmailForm.get('email');
  }

  get password(): any {
    return this.changePasswordForm.get('password');
  }

  get passwordConfirmed(): any {
    return this.changePasswordForm.get('passwordConfirmed');
  }

  ngOnDestroy(): void {
    this.darkServiceSubscription.unsubscribe();
  }

}
