import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FilterPipe} from './pipes/filter.pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RoomComponent } from './room/room.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent, FilterPipe, RoomComponent, HomeComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot()   
  ],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
