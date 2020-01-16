import { Component } from "@angular/core";
declare var $: any;
import { CrystalService } from "./crystal.service";
import { FilterPipe } from "./pipes/filter.pipe";

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
  public showMoreFilters = false;

  constructor(private crystalService: CrystalService) {
    this.populateRooms();
    this.getLocations();
    this.getEquipments();
    this.getServices();
  }

  ngOnInit() { }

  public semanticInitialize() {
    // Semantic UI Range
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
    this.crystalService.getResourceProfiles().subscribe(data => {
      this.rooms = data["resource_profile"];
      this.maxAvailableCapacity = Math.max.apply(
        Math,
        this.rooms.map(function (o) {
          return o.capacity;
        })
      );
      this.semanticInitialize();
    });
  }

  public toggleMoreFilters() {
    this.showMoreFilters = !this.showMoreFilters;
  }

  public getLocations() {
    this.crystalService.getLocations().subscribe(data => {
      this.locations = data["location_level"];
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
      )
        this.selectedLocation[i] = "";
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

  public getDropdownList(obj, level){
      if (level == 1) return obj;
      obj.forEach(location => {
        let loc = (location.children.length )

      });
      for(let i = 0; i<level; i++){

      }
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
    });
  }
  public getServices() {
    this.crystalService.getServices().subscribe(data => {
      this.services = data;
    });
  }
}
