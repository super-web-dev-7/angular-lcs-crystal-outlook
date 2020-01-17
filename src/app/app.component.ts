import { Component } from "@angular/core";
declare var $: any;
import { CrystalService } from "./crystal.service";
import { FilterPipe } from "./pipes/filter.pipe";
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: "app-home",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
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
  Arr = Array;
  public locationLevels;
  public selectedLocation = {};
  public allLocationAtLevel = {};
  public equipments;
  public services;
  public showMoreFilters = true;
  public dropdownList_equipments = [];
  public selectedItems_equipments = [];
  public dropdownSettings_equipments: IDropdownSettings = {};
  public dropdownList_services = [];
  public selectedItems_services = [];
  public dropdownSettings_services: IDropdownSettings = {};

  constructor(private crystalService: CrystalService) {
    this.populateRooms();
    this.getLocations();
    this.getEquipments();
    this.getServices();
    this.getResourceProfiles();
  }

  ngOnInit() { }

  public renderCapacitySlider() {
    this.renderDropdowns();
    $("#range-3").range({
      min: 1,
      max: this.maxAvailableCapacity,
      start: this.selectedCapacity,
      step: 1,
      onChange: value => this.updateSelectedCapacity(value)
    });
  }

  public updateSelectedCapacity(value) {
    this.selectedCapacity = value;
  }

  public populateRooms() {
    this.crystalService.getResources().subscribe(data => {
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

  public getLocations() {
    this.crystalService.getLocations().subscribe(data => {
      this.locations = data["location_level"];
      this.renderDropdowns();
      this.locationLevels = this.getRecursiveLength(this.locations);
      for (let i = 0; i < this.locationLevels; i++) {
        this.selectedLocation[i] = "";
      }
    });
  }

  public locationLevelChanged(i, location) {
    this.selectedLocation[i] = location;
  }

  public getLocationLevel(i: number) {
    if (i > 0) {
      if (
        !this.containsObject(this.selectedLocation[i], this.selectedLocation[i - 1].children) 
        || this.selectedLocation[i - 1] == ""
      ){
        this.selectedLocation[i] = "";
        $($('.locations>div')[i]).dropdown('clear');
      }
      if (this.selectedLocation[i - 1] != "") {
        return this.selectedLocation[i - 1].children;
      } else {
        return [];
      }
    } else {
      return this.locations;
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
      if (location.children.length != 0) {
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
    this.crystalService.getBuildings().subscribe(data => {
      this.buildings = data[0]["children"];
    });
  }

  public populateFloors() {
    this.floors = this.selectedBuilding["children"];
  }

  public update() {
    this.selectedCapacity = 15;
  }

  public getEquipments() {
    this.crystalService.getEquipments().subscribe(data => {
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
    this.crystalService.getServices().subscribe(data => {
      this.services = data;
      //this.dropdownList_services = this.services;
      this.dropdownList_services = [
        { id: 1, name: 'service1' },
        { id: 2, name: 'service2' },
        { id: 3, name: 'service3' },
        { id: 4, name: 'service4' },
        { id: 5, name: 'service5' }
      ];
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

  public getLocationPath(pathSoFar, location){
    let path = pathSoFar;
    path += path == "" ? location.name : "/" + location.name;
    if(location.children == undefined){
      return path;
    }
    else{
      this.getLocationPath(path,location.children);
    }
  }

  public getResourceProfiles() {
    this.crystalService.getResourceProfiles().subscribe(data => {
      this.resourceProfiles = data["resource_profile"];
      this.renderDropdowns();
    });
  }
  
  resetFilters(){
    this.showMoreFilters = !this.showMoreFilters;
    this.selectedItems_equipments = [];
    this.selectedItems_services = [];
  }

  renderDropdowns(){
    $('.ui.dropdown').dropdown({
      "clearable": true
     });
  }


  }
