import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  test : Date = new Date();
  focus: any;
  focus1: any;
  focus2: any;
  constructor() { }

  ngOnInit(): void {
  }

}
