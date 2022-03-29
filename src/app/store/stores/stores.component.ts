import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeolocateUserService } from 'src/app/_services/geolocate-user.service';
import { RestaurantsService } from 'src/app/_services/restaurants.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {

  focus: any;
  locate!: boolean;
  currentAddressString!: string;
  coordinates: any;
  restaurantList: any[] = [];
  loading: boolean = false;
  typeSelected: string = 'ball-scale-pulse';

  constructor(private geolocateUserService: GeolocateUserService, private router: Router, private  restaurantsService: RestaurantsService, private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAddress();
  }

  getAddress() {
    this.loading = true;
    this.geolocateUserService.userAddressString$.subscribe(data => {
      this.currentAddressString = data
      if (this.currentAddressString) {
        this.locate = true;
        this.getRestaurants();
      } else {
        this.geolocateUserService.getPosition();
        // this.getAddress();
      }
      console.log('Current Address String: ', this.currentAddressString);

    });
  }

  public showSpinner(): void {
    this.spinnerService.show();

    setTimeout(() => {
      this.spinnerService.hide();
    }, 5000); // 5 seconds
  }
  fetchRestaurantList() {
    this.restaurantsService.restaurantsDataSourceObj$.subscribe(data => {
        let results: any[] = [];
        results = data;
        if (this.restaurantList && this.restaurantList.length) {
          this.restaurantList = [...results];
        } else {
          this.restaurantList = results;
        }
        this.loading = false;
    });
  }

  reduceLength(str: string) {
    if (str.length > 22) {
      return str.substring(0, 22) + '...';
    } else {
      return str;
    }
  }

  updateAddress() {
    if (this.currentAddressString) {
      this.locate = !this.locate;
      this.geolocateUserService.updateAddressString(this.currentAddressString);
    }
  }

  gotoDetails(item: { id: any; }) {
    this.router.navigateByUrl(`stores/details/${item.id}`);
  }

  getRestaurants() {
    this.geolocateUserService.coordinatesObj$.subscribe(data => {
      this.coordinates = data
    });
    this.restaurantsService.fetchRestaurantsNearMe(this.coordinates.lat, this.coordinates.long, 50, 0, 'restaurants', 3000, "POI");
    this.fetchRestaurantList();
  }


}
