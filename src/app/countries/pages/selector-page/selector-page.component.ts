import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import {
  Country,
  Region,
  SmallCountry,
} from '../../interfaces/coiuntry.interface';
import { filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  public myForm: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    border: ['', [Validators.required]],
  });

  public countriesByRegion: SmallCountry[] = [];

  public countryBorder: SmallCountry[] = [];
  /**
   * 2da forma sin onInit
   */
  // public selectedRegion?:Region

  constructor(
    private readonly fb: FormBuilder,
    private readonly countriesService: CountriesService,
  ) {}

  ngOnInit() {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  ngOnDestroy() {
  
  }
  get regions(): Region[] {
    const region = this.countriesService.regions;
    return region;
  }
  

  onRegionChanged(): void {
    this.myForm
      .get('region')
      ?.valueChanges.pipe(
        tap(() => this.myForm.get('country')?.setValue('')),
         //como 'Seleccionar Pais' apunta al string vacío de country, al yo setear el string vacío apenas haya un cambio el valor de  la region, vuleve a apuntar al string vacío, o sea 'Seleccionar país'
        tap( () => this.countryBorder = [] ), 
        switchMap((region) => {
          return this.countriesService.getCountriesByRegion(region);
        }) //Permite recibir el valor de un observable y suscribirme a otro.
      )
      .subscribe((countries) => {
        this.countriesByRegion = countries;
      });
  }

  onCountryChanged(): void {
    this.myForm
      .get('country')
      ?.valueChanges.pipe(
        
        tap(() => this.myForm.get('border')?.setValue('')),
        filter( (data: string) => data.length > 0),
        switchMap((alphaCode) =>
          this.countriesService.getCountryByAlphaCode(alphaCode),
        ),
        map(country => country.borders), 
        switchMap( (country) => this.countriesService.getCountryBorderByCca3(country))
      )
      .subscribe((countries) => {
        this.countryBorder = countries;
      });
  }

  /**
   * 2da forma sin onInit()
   */
  /*getCountriesByRegion (){
    let region = this.selectedRegion
    console.log("paso por aqui")
    return this.countriesService.getCountriesByRegion(region)
      .subscribe( (countries: Country[]) => {
        this.country = countries
      })
  }*/

  // selectedReg(): Region | undefined{

  //   let newValue =  this.myForm.get("region")!.value;
  //   this.selectedRegion = newValue;

  //   console.log(this.selectedRegion);

  //   return newValue
  // }
}
