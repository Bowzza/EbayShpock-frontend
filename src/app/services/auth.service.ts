import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthData } from '../model/auth-data';
import { environment } from '../../environments/environment';

// const AUTH_API = 'http://localhost:3000/api/users/';
// const AUTH_API = 'https://ebayshpockscraper-backend.herokuapp.com/api/users/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null | undefined;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();
  private errorMessageListener = new Subject<string>();
  private loadingListener = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private errorMessage: string = 'oje';

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post(
      environment.api+'api/users/register', authData).subscribe(() => {
      this.loadingListener.next(false);
      this.router.navigate(['/']);
    }, err => {
      this.loadingListener.next(false);
      this.errorMessageListener.next(err.error.message);
    });
  }

  loginUser(email: string, password: string): void {
    const authData: AuthData = {email, password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(environment.api+'api/users/login', authData).subscribe(res => {
      const token = res.token;
      this.token = token;
      if(token) {
        const expiresInDuration = res.expiresIn;
        const userId = res.userId;
        this.setAuthTimer(expiresInDuration);
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate, userId);
        this.isAuthenticated = true;
        this.loadingListener.next(false);
        this.router.navigate(['/']);
      }
    }, err => {
      this.loadingListener.next(false);
      this.errorMessageListener.next(err.error.message);
    });
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  getToken() {
    return this.token;
  }

  getUserId(): string | null {
    const userId = localStorage.getItem('userId');
    return userId;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getErrorMessageListener(): Observable<string> {
    return this.errorMessageListener.asObservable();
  }

  getLoadingListener(): Observable<boolean> {
    return this.loadingListener.asObservable();
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    const now = new Date();
    if(!authInfo?.expirationDate) return;
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInfo?.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout(): void {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration*1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if(!token || !expirationDate) return;
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
