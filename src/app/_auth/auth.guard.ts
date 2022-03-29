import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import {AuthenticationService} from './authentication.service'

@Injectable({
  providedIn: 'root'
})
export class AuthCustGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): boolean {
      if (this.auth.isLoggedIn()){
        return true;
      }
      this.router.navigateByUrl('/auth/login');
      return false;
  }

}
