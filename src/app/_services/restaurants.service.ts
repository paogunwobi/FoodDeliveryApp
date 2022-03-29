import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  private tomtomKey = environment.tomtomKey
  errorMsg: string = '';
  restaurants: any = {}
  restaurantsDataSource: any[] = [];
  restaurantsObj$ = new BehaviorSubject<any>(this.restaurants);
  restaurantsDataSourceObj$ = new BehaviorSubject<any[]>(this.restaurantsDataSource);

  constructor(private httpClient: HttpClient) { }

  fetchRestaurantsNearMe(lat: number, long: number, limit: number, offset: number, searchString: string = 'restaurants', radius: number = 3000, extendedPostalCodesFor: string = "POI") {
    const url = `https://api.tomtom.com/search/2/search/${searchString}.json?limit=${limit}&ofs=${offset}&lat=${lat}&lon=${long}&radius=${radius}&extendedPostalCodesFor=${extendedPostalCodesFor}&minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&openingHours=nextSevenDays&relatedPois=off&key=${this.tomtomKey}`;
    this.httpClient.get(url).pipe(catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = this.getServerErrorMessage(error);
        }
        return throwError(() => errorMsg)
    })).subscribe(data => {
      this.restaurants = data;
      this.restaurantsObj$.next(data);
      this.restaurantsObj$.complete();
      const { results } = this.restaurants;
      console.log('Restaurants Data: ', results);
      if (results && results.length > 0) {
        if (this.restaurantsDataSource && this.restaurantsDataSource.length) {
          this.restaurantsDataSource = [...this.restaurantsDataSource, ...results];
        } else {
          this.restaurantsDataSource = [...results];
        }
        this.restaurantsDataSourceObj$.next(this.restaurantsDataSource);
        // this.restaurantsDataSourceObj$.complete();
      }
    })
  }

//Get Http server errors
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
