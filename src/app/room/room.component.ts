import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { map, filter} from 'rxjs/operators';
import {Observable} from 'rxjs/observable';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
 
  data: any;
  room: any;
  services: any;
  selectedServices: any = [];
  availableServices: any = [];
  allServices: any = [];
  availedServices: any = [];
  servicePageClass: string[] = [];
  currentPage: number;
  totalPages: number;
  availedServicesCount: number;
 
  constructor(private router:Router, private activatedRoute:ActivatedRoute) {
    this.data = this.router.getCurrentNavigation().extras.state;
    this.room = this.data.room;
    this.services = this.data.services;
    this.currentPage = 1;
    this.availableServices = this.room.services;
    for(let i=0; i< this.availableServices.length; i++){
      this.selectedServices[this.availableServices[i]] = {}
      this.selectedServices[this.availableServices[i]].id = this.availableServices[i];
      this.selectedServices[this.availableServices[i]].isSelected = true;
      for (let k = 0; k < this.services.length; k++) {
          if (this.services[k].id == this.availableServices[i]) {
            this.selectedServices[this.availableServices[i]].data = this.services[k];
            break;
          }
      }
    }
    this.allServices = Object.values(this.selectedServices);
    this.availedServices = this.allServices;
    this.availedServicesCount = this.availedServices.length;
    this.totalPages = 3 + this.availedServicesCount;
  }

  ngOnInit() {
      console.log(this.room);
  }

  public getLocationPath(){
      let loc = this.room.location;
      let path = loc.name;
        while(loc.children && loc.children.name){
          path += '/' + loc.children.name;
          loc = loc.children;
        }
      return path;
  }

  public previousPage(){
    this.currentPage--;
  }

  public nextPage(){
    if(this.currentPage != this.totalPages)
      this.currentPage++;
  }

  public updateAvailedServiceList(service){
    this.selectedServices[service].isSelected = !this.selectedServices[service].isSelected; 
    this.allServices = Object.values(this.selectedServices);
    this.availedServices = [];
    for (let k = 0; k < this.allServices.length; k++) {
        if (this.allServices[k].isSelected) {
          this.availedServices.push(this.allServices[k]);
        }
    }
        
    this.availedServicesCount = this.availedServices.length;
    this.totalPages = 3 + this.availedServicesCount;
    
  }

}
