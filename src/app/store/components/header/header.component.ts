import { GeolocateUserService } from './../../_services/geolocate-user.service';
import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;
  private lastPoppedUrl: string | undefined;
  private yScrollStack: number[] = [];

  currentDate = new Date();

  // the locales the app supports
  locales = [
    { label: 'English (US)', value: 'en-US' },
    { label: 'English (UK)', value: 'en-GB' },
    { label: 'Français', value: 'fr' },
    { label: 'German', value: 'de-CH' },
    { label: 'Itailian', value: 'it-CH' }
  ];

  // the user's locale
  detectedLocale = '';
  // the default locale
  locale = this.locales[0].value;
  userLocation: GeolocationPosition | undefined;

  constructor(private router: Router, private translocoService: TranslocoService, private geolocateUserService: GeolocateUserService, public location: Location) {
    this.detectedLocale = this.getUsersLocale('en-US');

    // generate a regex from the locales we support
    const supportedRegex = new RegExp('^' + this.locales.map(l => l.value.substring(0, 2)).join('|^'));
    // check if the user's preferred language is supported and if so, use it.
    if (this.detectedLocale.match(supportedRegex)) {
      this.updateLocale(this.detectedLocale);
    }
  }

  ngOnInit(): void {
    this.getUserLocation();

    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      if (event instanceof NavigationStart) {
         if (event.url != this.lastPoppedUrl)
             this.yScrollStack.push(window.scrollY);
     } else if (event instanceof NavigationEnd) {
         if (event.url == this.lastPoppedUrl) {
             this.lastPoppedUrl = undefined;
            //  window.scrollTo(0, this.yScrollStack.pop());
         } else
             window.scrollTo(0, 0);
     }
   });
   this.location.subscribe((ev: PopStateEvent) => {
       this.lastPoppedUrl = ev.url;
   });
  }

  getUserLocation() {
    this.geolocateUserService.userLocationObj$.subscribe(data =>{
      this.userLocation = data
      console.log('User Location Data, Header: ', this.userLocation)
    });
  }

  getUsersLocale(defaultValue: string): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return defaultValue;
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : defaultValue;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    return lang;
  }
  // change locale/language at runtime
  updateLocale(locale: string) {
    console.log('update locale', locale);
    if (this.locales.some(l => l.value === locale)) {
      this.locale = locale;
    }
    const lang = locale.substring(0, 2);
    this.translocoService.setActiveLang(lang);
  }

  isHome() {
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if( titlee === '/' ) {
        return true;
    }
    else {
        return false;
    }
  }

}
