import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  showPassword: boolean = true;
  screen: number = 1;
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  gotoView(type: string) {
    let current = 0;
    if (type == 'next') {
      current = this.screen + 1;
    }
    if (type == 'login') {
      this.router.navigateByUrl('auth/login');
    }
    if (current < 1) {
      current = 1;
    }
    this.screen = current;
  }

}
