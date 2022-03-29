import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeolocateUserService } from '../_services/geolocate-user.service';
import { Location, PopStateEvent } from '@angular/common';
import { Subscription } from 'rxjs';
import { NgcCookieConsentService, NgcInitializeEvent, NgcNoCookieLawEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  focus: any;
  userLocation: GeolocationPosition | undefined;
  locate = false;
  userAddressObj: any | undefined;
  userAddress: any;
  currentAddressString!: string;

  private popupOpenSubscription: Subscription = new Subscription;
  private popupCloseSubscription: Subscription = new Subscription;
  private initializeSubscription: Subscription = new Subscription;
  private statusChangeSubscription: Subscription = new Subscription;
  private revokeChoiceSubscription: Subscription = new Subscription;
  private noCookieLawSubscription: Subscription = new Subscription;

  constructor(private geolocateUserService: GeolocateUserService, public location: Location, private ccService: NgcCookieConsentService) { }

  ngOnInit(): void {
    this.getUserLocation();
      // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(() => {
      // you can use this.ccService.getConfig() to do stuff...
    });

    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(() => {
      // you can use this.ccService.getConfig() to do stuff...
    });

    this.initializeSubscription = this.ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );

    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );

    this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );

    this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );
  }

  handleClickSound() {
    let x = <HTMLVideoElement>document.getElementById("myAudio");
    x.play();
  }

  getUserLocation() {
    this.geolocateUserService.getPosition();
    this.geolocateUserService.userAddressString$.subscribe(data =>{
      this.currentAddressString = data
      if (this.currentAddressString) {
        this.locate = true;
      }
      console.log('Home User Address Data: ', this.userAddress)
      console.log('Current Address String: ', this.currentAddressString);
    });
  }

  public AddressChange(address: any) {
    this.locate = false;
    //setting address from API to local variable
    console.log('Address Data from Google: ', address);
    this.currentAddressString = address.formatted_address;
    this.geolocateUserService.updateAddressString(this.currentAddressString);
  }

  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializeSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }

}
