import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

let authToken = "ab70de5d-99eb-4672-b01c-e2003bd999aa"
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': authToken
  })
};

@Injectable({
  providedIn: 'root'
})
export class CrystalService {

  constructor(private httpClient: HttpClient) { }

  // public apiUrl = "https://localhost:44316/api/workspace/outlook";
  // public apiUrl = "https://ise2020.crystalunivers.com/api/workspace/outlook";
  public apiUrl = "/api/workspace/outlook";
  // public apiUrl = " https://lcs.mockable.io";
  public getLocations(userEmail: string, userTimezone: string, userLocale: string){
    return this.httpClient.get(this.apiUrl+"/locations?email="+userEmail+"&timezone="+userTimezone+"&language="+userLocale, httpOptions);
  }

  public getEquipments(){
    return this.httpClient.get(this.apiUrl+"/equipments", httpOptions);
  }

  public getResourceProfiles(){
    return this.httpClient.get(this.apiUrl+"/resource_profiles", httpOptions);
  }

  public getResources(start: string, end: string, userEmail: string, userTimezone: string, userLocale: string){
    return this.httpClient.get(this.apiUrl+"/resources?start="+start+"&end="+end+"&email="+userEmail+"&timezone="+userTimezone+"&language="+userLocale, httpOptions);
  }

  public getServices(){
    return this.httpClient.get(this.apiUrl+"/services", httpOptions);
  }

  public getBuildings(userEmail: string, userTimezone: string, userLocale: string){
    return this.httpClient.get(this.apiUrl+"/buildings?email="+userEmail+"&timezone="+userTimezone+"&language="+userLocale, httpOptions);
  }

  public createMeetingAsync(data: Array<Object>): Observable<Object>{
    return this.httpClient.post(this.apiUrl+"/book", data, httpOptions);
  }
}