import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
declare var $: any;
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { map, filter } from "rxjs/operators";
import { Observable } from "rxjs/observable";
import { CrystalService } from "../crystal.service";

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.css"]
})
export class RoomComponent implements OnInit {
  @Input()
  data: any = {};
  @Input()
  currentLocation: any;
  @Input()
  isOutlookWeb: boolean;

  @Output()
  goBack: EventEmitter<number> = new EventEmitter<number>();

  room: any;
  services: any;
  equipmentsMap: any;
  selectedServices: any = [];
  availableServices: any = [];
  allServices: any = [];
  availedServices: any = [];
  servicePageClass: string[] = [];
  currentPage: number;
  totalPages: number;
  availedServicesCount: number;
  orderDetails: any;
  JSON: any;
  bookingConfirmed: boolean = false;
  errorOcurred: boolean = false;
  requestInProgress: boolean = false;
  responseMessage: string = "";

  constructor(private crystalService: CrystalService) {}

  ngOnInit() {
    if (this.data) {
      this.JSON = JSON;
      //this.data = this.router.getCurrentNavigation().extras.state;
      this.room = this.data.room;
      this.services = this.data.services;
      this.equipmentsMap = {};
      for (let k = 0; k < this.data.equipments.length; k++) {
        this.equipmentsMap[this.data.equipments[k].id] = this.data.equipments[
          k
        ];
      }
      this.currentPage = 1;
      this.availableServices = this.room.services;
      for (let i = 0; i < this.availableServices.length; i++) {
        this.selectedServices[this.availableServices[i]] = {};
        this.selectedServices[
          this.availableServices[i]
        ].id = this.availableServices[i];
        this.selectedServices[this.availableServices[i]].isSelected = true;
        for (let k = 0; k < this.services.length; k++) {
          if (this.services[k].id == this.availableServices[i]) {
            this.selectedServices[
              this.availableServices[i]
            ].data = this.services[k];
            break;
          }
        }
      }
      this.allServices = Object.values(this.selectedServices);
      this.availedServices = this.allServices;
      this.availedServicesCount = this.availedServices.length;
      this.totalPages = 3 + this.availedServicesCount;
      this.updateAvailedServiceList("__intialload__");
    }
  }

  ngAfterViewInit(){
    $('[data-toggle="tooltip"]').popup({
      on: 'hover',
      position : 'left center'
    });
  }

  public getLocationPath() {
    let loc = this.room.location;
    let path = loc.name;
    while (loc.children && loc.children.name) {
      path += " / " + loc.children.name;
      loc = loc.children;
    }
    return path;
  }

  public setPage(i) {
    if (i < this.currentPage) this.currentPage = i;
  }

  public previousPage() {
    this.currentPage--;
    if(this.errorOcurred === true){
      this.errorOcurred = false;
    }
  }

  public nextPage() {
    if (this.currentPage != this.totalPages) this.currentPage++;
  }

  public updateAvailedServiceList(service) {
    if (service != "__intialload__")
      this.selectedServices[service].isSelected = !this.selectedServices[
        service
      ].isSelected;
    this.allServices = Object.values(this.selectedServices);
    this.availedServices = [];
    for (let k = 0; k < this.allServices.length; k++) {
      if (this.allServices[k].isSelected) {
        this.availedServices.push(this.allServices[k]);
      }
    }

    this.availedServicesCount = this.availedServices.length;
    this.totalPages = 3 + this.availedServicesCount;

    this.orderDetails = {};
    this.orderDetails.room = this.room;
    this.orderDetails.capacity = this.data.capacity;
    this.orderDetails.services = {};

    for (let i = 0; i < this.availedServices.length; i++) {
      this.orderDetails.services[this.availedServices[i].id] = {};
      this.orderDetails.services[this.availedServices[i].id].orderRemarks = "";
      this.orderDetails.services[
        this.availedServices[i].id
      ].name = this.availedServices[i].data.name;
      this.orderDetails.services[
        this.availedServices[i].id
      ].image = this.availedServices[i].data.image;
      for (
        let j = 0;
        j < this.availedServices[i].data.service_items.length;
        j++
      ) {
        this.orderDetails.services[this.availedServices[i].id][
          this.availedServices[i].data.service_items[j].id
        ] = {
          name: this.availedServices[i].data.service_items[j].name,
          quantity: 0,
          price: this.availedServices[i].data.service_items[j].price,
          itemRemarks: "",
          cost: 0
        };
      }
    }
  }

  addQuantity(serviceID, itemID) {
    this.orderDetails.services[serviceID][itemID].quantity++;
    this.orderDetails.services[serviceID][itemID].cost =
      this.orderDetails.services[serviceID][itemID].quantity *
      this.orderDetails.services[serviceID][itemID].price;
  }

  removeQuantity(serviceID, itemID) {
    if (this.orderDetails.services[serviceID][itemID].quantity != 0) {
      this.orderDetails.services[serviceID][itemID].quantity--;
      this.orderDetails.services[serviceID][itemID].cost =
        this.orderDetails.services[serviceID][itemID].quantity *
        this.orderDetails.services[serviceID][itemID].price;
    }
  }

  goHome() {
    Office.context.mailbox.item.enhancedLocation.removeAsync(
      this.currentLocation
    );
    this.goBack.emit(0);
  }

  getImageHTML(room){
    return "<img style='width:90%;' src='"+room.floorMapLocation+"'>";
  }

  createMeetingAsync() {
    this.requestInProgress = true;
    if(this.errorOcurred){
      this.errorOcurred = false;
    }
    this.crystalService.createMeetingAsync(this.orderDetails).subscribe((data)=>{
      this.bookingConfirmed = true;
    }, error => {
      this.responseMessage = error.error.responseMessage;
      this.errorOcurred = true;
      this.requestInProgress = false; 
    });
  }
}
