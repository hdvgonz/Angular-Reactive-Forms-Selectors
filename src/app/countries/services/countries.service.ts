import { Injectable } from '@angular/core';
import { Region, Country, SmallCountry } from '../interfaces/coiuntry.interface';
import {HttpClient} from "@angular/common/http";
import { Observable, combineLatest, filter, map, of, pipe, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  
  private _regions: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europa, Region.Oceania ];

  private readonly _url = 'https://restcountries.com/v3.1'
  
  constructor(
    private readonly http: HttpClient
  ) {}


  get regions():Region[] {
    return structuredClone(this._regions);
  }

  getCountriesByRegion( region: Region): Observable<SmallCountry[]> {

    if (!region) 
      return of([]);

    const url = `${this._url}/region/${region}?fields=cca3,name,borders`

    return this.http.get<Country[]>(url)
      .pipe(
        map( countries =>countries.map( country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        })) ),
      )
  }

  getCountryByAlphaCode(alphaCode: string):Observable<SmallCountry> {

    const url: string = `${this._url}/alpha/${alphaCode}?fields=cca3,name,borders`;

    return this.http.get<Country>(url)
      .pipe(
        map (country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        })),
      )
  }

  getCountryBorderByCca3 (borders: string[]): Observable<SmallCountry[]> {
    if(borders.length === 0 || !borders)  return of([]);

    const countriesRequests:Observable<SmallCountry>[] = [];

    borders.forEach( cca3 =>{
      const request = this.getCountryByAlphaCode(cca3);
      countriesRequests.push(request);
    });

    //emite hasta que todos los observables que estan dentro del arreglo emitan un valor, todos se disparan de manera simultanea
    return combineLatest(countriesRequests)
  }
  /**
   * 2da forma sin usar onInit()
   * 
   getCountriesByRegion (region:Region | undefined): Observable<Country[]>{
     return this.http.get<Country[]>(`${this._url}${region}`)
       .pipe(
        map( (countries) => countries)
       )
 }   
   */
}
