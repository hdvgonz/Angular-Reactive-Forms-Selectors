import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    //lazy loading
    path: 'countries',
    loadChildren: () => import('./countries/countries.module').then(m => m.CountriesModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule
    ]
})
export class AppRoutingModule { }
