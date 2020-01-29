import { Component, OnInit } from '@angular/core';
declare var $: any;
import { CrystalService } from "../crystal.service";
import { FilterPipe } from "../pipes/filter.pipe";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = "lcs-crystal-outlook-plugin";
  public locations;
  public selectedCountry;
  public selectedBuilding;
  public cities;
  public buildings;
  public floors;
  public rooms;
  public resourceProfiles;
  public selectedResourceProfile = "";
  public isLoaded = false;
  public searchText = "";
  public maxAvailableCapacity;
  public selectedCapacity = 1;
  public selectedRoomData = {};
  Arr = Array;
  public locationLevels;
  public locationLevelDropdowns: any = [];
  public selectedLocation = [];
  public allLocationAtLevel = {};
  public locationPaths = {};
  public equipments;
  public services;
  public showMoreFilters = true;
  public dropdownList_equipments = [];
  public selectedItems_equipments = [];
  public dropdownSettings_equipments: IDropdownSettings = {};
  public dropdownList_services = [];
  public selectedItems_services = [];
  public dropdownSettings_services: IDropdownSettings = {};
  public dropdownList_resourceProfiles = [];
  public selectedItems_resourceProfiles = [];
  public dropdownSettings_resourceProfiles: IDropdownSettings = {};
  public showRoomDetails:boolean = false;
  public appointmentStartTime: string;
  public appointmentEndTime: string;
  public currentCulture: string;
  public isOutlookWeb: boolean = false;
  public organizerEmail: string;
  public userTimezone: string;
  private readonly supportedCultures = ["en-US","fr-FR"];

  constructor(private crystalService: CrystalService, private translateService: TranslateService) {
    this.getLocations();
    this.getEquipments();
    this.getServices(); 
  }

  ngOnInit() {
   this.setLocale();
   let promise1 = Office.context.mailbox.item.start.getAsync((data)=>{
     this.appointmentStartTime = data.value.toLocaleString();
   });
   let promise2 = Office.context.mailbox.item.end.getAsync((data)=>{
    this.appointmentEndTime = data.value.toLocaleString();
  });
  let promise3 = Office.context.mailbox.item.organizer.getAsync((data)=>{
    this.organizerEmail = data.value.emailAddress;
  });
  this.userTimezone =  Office.context.mailbox.userProfile.timeZone;
  console.log(this.userTimezone);
  Promise.all([promise1,promise2]).then(()=>{
    this.populateRooms(this.appointmentStartTime, this.appointmentEndTime);
  })
  }

  public setLocale(){
    this.currentCulture =  Office.context ? Office.context.displayLanguage : "en-US";
    // fallback to en-US if culture not supported
    if(this.supportedCultures.indexOf(this.currentCulture) === -1)
    {
      this.currentCulture = "en-US";
    }
    this.translateService.use(this.currentCulture);
    if(Office.context.mailbox.diagnostics.hostName === "OutlookWebApp"){
      this.isOutlookWeb = true;
    }
  }

  public populateRooms(start, end) {
    this.crystalService.getResources(start, end, this.organizerEmail, this.userTimezone, this.currentCulture).subscribe(data => {
      this.rooms = data["resources"];
      this.maxAvailableCapacity = Math.max.apply(
        Math,
        this.rooms.map(function (o) {
          return o.capacity;
        })
      );
      this.renderCapacitySlider();
    });
  }

  public renderCapacitySlider() {
    this.renderDropdowns();
    $("#range-3").range({
      min: 1,
      max: this.maxAvailableCapacity,
      start: this.selectedCapacity,
      step: 1,
      onChange: value => this.updateSelectedCapacity(value)
    });
    this.getResourceProfiles();
  }

  public updateSelectedCapacity(value) {
    this.selectedCapacity = value;
  }

  public getLocations() {
    this.crystalService.getLocations(this.organizerEmail, this.userTimezone, this.currentCulture).subscribe(data => {
      this.locations = data["location_level"];
      this.renderDropdowns();
      this.locationLevels = this.getRecursiveLength(this.locations);
      for (let i = 0; i < this.locationLevels; i++) {
        this.selectedLocation[i] = "";
        this.locationLevelDropdowns[i] = [];
      }
      this.locationLevelDropdowns[0] = this.locations;
      this.setLocationPaths();
    });
  }

  public setLocationLevel(i: number) {
    if (i > 0 && i < this.locationLevels) {
      // reset filter
      if (
        !this.containsObject(this.selectedLocation[i], this.selectedLocation[i - 1].children) 
        || this.selectedLocation[i - 1] == ""
      ){
        this.selectedLocation[i] = "";
        $($('.locations>div')[i]).dropdown('clear');
      }
      // generate list
      if (this.selectedLocation[i - 1] != "") {
        this.locationLevelDropdowns[i] = this.selectedLocation[i - 1].children;
      } else {
        this.locationLevelDropdowns[i] = [];
      }
    } 
  }

  public containsObject(obj, list) {
    if (!list) return false;
    for (let i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }

    return false;
  }

  public getRecursiveLength(obj) {
    obj.forEach(location => {
      if (location.children && location.children.length != 0) {
        length = 1 + this.getRecursiveLength(location.children);
      } else {
        length = 1;
      }
    });
    return length;
  }

  public populateCities() {
    this.cities = this.selectedCountry["children"];
    this.getBuildings();
  }

  public getBuildings() {
    this.crystalService.getBuildings(this.organizerEmail, this.userTimezone, this.currentCulture).subscribe(data => {
      this.buildings = data[0]["children"];
    });
  }

  public populateFloors() {
    this.floors = this.selectedBuilding["children"];
  }

  public update() {
    this.selectedCapacity = 15;
  }

  public getResourceProfiles() {
    this.crystalService.getResourceProfiles(this.organizerEmail, this.userTimezone, this.currentCulture).subscribe(data => {
      this.resourceProfiles = data["resource_profile"];
      this.dropdownList_resourceProfiles = this.resourceProfiles;
      this.selectedItems_resourceProfiles = [];
      this.dropdownSettings_resourceProfiles = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: false
      };
      this.renderDropdowns();
    });
  }

  public getEquipments() {
    this.crystalService.getEquipments(this.organizerEmail, this.userTimezone, this.currentCulture).subscribe(data => {
      this.equipments = data["equipments"];
      this.dropdownList_equipments = this.equipments;
      this.selectedItems_equipments = [];
      this.dropdownSettings_equipments = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: false
      };
    });

    
  }

  public getServices() {
    this.crystalService.getServices(this.organizerEmail, this.userTimezone, this.currentCulture).subscribe(data => {
      this.services = data;
      this.dropdownList_services = this.services;
      // this.dropdownList_services = [
      //   { id: 1, name: 'service1' },
      //   { id: 2, name: 'service2' },
      //   { id: 3, name: 'service3' },
      //   { id: 4, name: 'service4' },
      //   { id: 5, name: 'service5' }
      // ];
      this.selectedItems_services = [];
      this.dropdownSettings_services = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: false
      };
    });
  }

  public setLocationPaths(){
    this.rooms.forEach(room => {
      let loc = room.location;
      let path = loc.name;
      for(let i = 0; i < this.locationLevels; i++){
        if(loc.children && loc.children.name){
          path += '/' + loc.children.name;
          loc = loc.children;
        }
        else
        break;
      }
      this.locationPaths[room.id] = path;
    });
  }

  
  
  resetFilters(){
    this.showMoreFilters = !this.showMoreFilters;
    // this.selectedItems_equipments = [];
    // this.selectedItems_services = [];
    // this.selectedItems_resourceProfiles = [];
  }

  renderDropdowns(){
    $('.ui.dropdown').dropdown({
      "clearable": true
     });
  }

  roomSelected(data){
    this.selectedRoomData = data;
    this.showRoomDetails = true;
  }

  home(event) {
    this.showRoomDetails = !this.showRoomDetails;
  }

}