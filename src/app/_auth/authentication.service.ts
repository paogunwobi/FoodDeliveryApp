import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';

import 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserDetails {
  user_id: number,
  fname: string,
  lname:string,
  userName: string,
  email: string,
  password: string,
  exp: number,
  iat: number
}

export interface TokenPayload {
  user_id: number,
  fname: string,
  lname: string;
  username: string,
  email: string,
  password: string,
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token!: string | null;

  constructor(private http: HttpClient, private router: Router) { }

  //save token
  public saveToken(token: string): void {
    localStorage.setItem('userToken', token)
    this.token = token;
  }


  //get token
  public getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('userToken') !== null
        ? localStorage.getItem('userToken')
        : null;
    }
    return this.token;
  }

  //get user details
  public getUserDetails(): UserDetails | null {
    const token = this.getToken()
    let payload
    if (token) {
      payload = token.split('.')[1]
      payload = window.atob(payload)
      return JSON.parse(payload)
    } else {
      return null
    }
  }

  //Logged in
  public isLoggedIn(): boolean {
    const user = this.getUserDetails()
    if (user) {
      return user.exp > Date.now() / 1000
    } else {
      return false
    }
  }

  private request(method: 'post' | 'get', type: 'login' | 'register' | 'profile', user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`${environment.apiUrl}/${type}`, user);
    } else {
      base = this.http.get(`${environment.apiUrl}/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
    }

    const request = base.pipe(
      map((data: any) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload) {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload) {
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  //logout
  public logout(): void {
    this.token = null;
    window.localStorage.removeItem('userToken');
    this.router.navigateByUrl('/home')
  }

}
