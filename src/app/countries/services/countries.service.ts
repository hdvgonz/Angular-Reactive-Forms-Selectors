import { Injectable } from '@angular/core';
import { Region, Country } from '../interfaces/coiuntry.interface';
import {HttpClient} from "@angular/common/http";
import { Observable, filter, map, pipe, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  
  private _regions: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europa, Region.Oceania ];

  private readonly _url = 'https://restcountries.com/v3.1/region/'
  
  constructor(
    private readonly http: HttpClient
  ) {}


  get regions():Region[] {
    return structuredClone(this._regions);
  }

  getCountriesByRegion (region:Region | undefined): Observable<Country[]>{
    return this.http.get<Country[]>(`${this._url}${region}`)
      .pipe(
       map( (countries) => countries)
      )
}     
}
