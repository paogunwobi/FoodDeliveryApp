import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-storedetails',
  templateUrl: './storedetails.component.html',
  styleUrls: ['./storedetails.component.scss']
})
export class StoredetailsComponent implements OnInit {

  restaurantName!: string;
  address!: string;

  constructor() { }

  ngOnInit(): void {
    // to implements fetch by ID
    this.restaurantName = 'Delight Kitchen';
    this.address = 'Akinbode St, Lagos, Mushin'
  }

}
