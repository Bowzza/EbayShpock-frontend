import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-accountinfo',
  templateUrl: './accountinfo.component.html',
  styleUrls: ['./accountinfo.component.scss']
})
export class AccountinfoComponent implements OnInit {

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

  constructor(private authService: AuthService) { 
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

}
