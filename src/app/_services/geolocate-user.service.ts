import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocateUserService {

  private userLocation!: GeolocationPosition;
  private userAddress!: any;
  private addressString!: string;
  private suggestionObj!: any;
  private suggestions!: any;
  candidates: any;
  candidatesObj: any;
  coordinates: any = {};
  userLocationObj$ = new BehaviorSubject<any>(this.userLocation);
  userAddressObj$ = new BehaviorSubject<any>(this.userAddress);
  userAddressString$ = new BehaviorSubject<string>(this.addressString);
  addressSuggestionsData$ = new BehaviorSubject<any[]>(this.suggestions);
  coordinatesObj$ = new BehaviorSubject<any[]>(this.coordinates);

  constructor(private httpClient: HttpClient) {
    this.userLocationObj$.next(this.userLocation);
    this.userAddressObj$.next(this.userAddress);
    this.userAddressString$.next(this.addressString);
    this.addressSuggestionsData$.next(this.suggestions);
    this.coordinatesObj$.next(this.coordinates);
  }

  getPosition() {
    window.navigator.geolocation.getCurrentPosition(
      position => {
        this.userLocationObj$.next(position);
        this.getAddress(position.coords.longitude, position.coords.latitude);
        const fetchCoord = { long: position.coords.longitude, lat: position.coords.latitude};
        this.coordinates = fetchCoord;
        this.coordinatesObj$.next(this.coordinates);
        this.userLocationObj$.complete();
      },
      error => this.userLocationObj$.error(error)
    );
  }

  getAddress(long: number, lat: number) {
    const addressUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${long},${lat}`
    this.httpClient.get(addressUrl).pipe(catchError(error =>{
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message};
          }`
        } else {
         errorMsg = this.getServerErrorMessage(error);
        }
        return throwError(() => errorMsg)
    })).subscribe(data => {
      this.userAddress = data;
      console.log('Address Data: ', this.userAddress);
      this.userAddressObj$.next(data);
      // this.userAddressObj$.complete();
      const { address } = this.userAddress;
      if (address) {
        this.userAddress = address;
        this.addressString = address.LongLabel;
        this.userAddressString$.next(this.addressString);
        // this.userAddressString$.complete();
      }
    })
  }

  getAddressSuggestions(search: string) {
    const accessToken = environment.accessToken;
    const addressSuggestions = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?token=${accessToken}=pjson&text=${search}`
    this.httpClient.get(addressSuggestions).pipe(catchError(error =>{
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message};
          }`
        } else {
         errorMsg = this.getServerErrorMessage(error);
        }
        return throwError(() => errorMsg)
    })).subscribe(data => {
      this.suggestionObj = data;
      const { suggestions } = this.suggestionObj;
      this.suggestions = suggestions;
      console.log('Address Data: ', this.suggestions);
      this.addressSuggestionsData$.next(this.suggestions);
      // this.addressSuggestionsData$.complete();
    })
  }

  updateAddressString(value: string) {
    this.userAddressString$.next(value);
    // this.userAddressString$.complete();
  }

  getCoordinateFromString(str: string) {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${str}&category=&outFields=*&forStorage=false&f=pjson`;
    this.httpClient.get(url).pipe(catchError(error =>{
      let errorMsg: string;
      if (error.error instanceof ErrorEvent) {
        errorMsg = `Error: ${error.error.message};
        }`
      } else {
       errorMsg = this.getServerErrorMessage(error);
      }
      return throwError(() => errorMsg)
  })).subscribe(data => {
    this.candidatesObj = data;
    const { candidates } = this.candidatesObj;
    if (candidates.length > 0) {
      this.candidates = candidates;
      const fetchCoord = { long: this.candidates[0].location.x, lat: this.candidates[0].location.y};
      this.coordinates = fetchCoord;
      this.updateAddressString(this.candidates[0].LongLabel)
      this.coordinatesObj$.next(this.coordinates);
    };

    console.log('Address Data: ', this.suggestions);
    // this.addressSuggestionsData$.complete();
  })
  }

  private getServerErrorMessage(errorResponse: HttpErrorResponse): string{
    switch (errorResponse.status) {
      case 404: {
        return `Not Found: ${errorResponse.message}`;
      }
      case 403: {
        return `Access Denied: ${errorResponse.message}`;
      }
      case 500: {
        return `Internal Server Error: ${errorResponse.message}`;
      }
      default:{
        return `Unknown Server Error: ${errorResponse.message}`
      }
    }
  }
}
