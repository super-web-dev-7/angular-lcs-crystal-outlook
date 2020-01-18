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
  
  }
