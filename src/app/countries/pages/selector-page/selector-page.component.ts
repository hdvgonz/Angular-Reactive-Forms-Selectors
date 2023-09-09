import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Country, Region, SmallCountry } from '../../interfaces/coiuntry.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  public myForm: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    borders: ['', [Validators.required]],
  });

  public country: Country[] = [];
  /**
   * 2da forma sin onInit
   */
  // public selectedRegion?:Region

  constructor(
    private readonly fb: FormBuilder,
    private readonly countriesService: CountriesService
  ) {}

  ngOnInit() {
    this.onRegionChanged();
  }

  ngOnDestroy() {}

  get regions(): Region[] {
    const region = this.countriesService.regions;
    return region;
  }

  onRegionChanged(): void {
    this.myForm.get('region')?.valueChanges.subscribe((region) => {
      console.log({ region });
    });
  }

  getCountriesByRegion(region: Region): SmallCountry[]{

    return []
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
