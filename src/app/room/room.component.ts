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
 
  room: any;
 
  constructor(private router:Router, private activatedRoute:ActivatedRoute) {
    this.room = this.router.getCurrentNavigation().extras.state;
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

}
