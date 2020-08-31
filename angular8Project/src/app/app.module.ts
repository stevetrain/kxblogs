import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CalComponent }  from '../cal/cal.component';
import { OtherTabComponent } from '../otherTab/otherTab.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

const appRoutes: Routes = [
  { path: 'cal', component: CalComponent},
  { path: 'otherTab', component: OtherTabComponent },
  { path: '', redirectTo: '/cal', pathMatch: 'full'},
  { path: '**', redirectTo: '/cal'}
];

@NgModule({
  declarations: [
    AppComponent,
    CalComponent,
    OtherTabComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserAnimationsModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
