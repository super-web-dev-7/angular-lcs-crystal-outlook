import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrystalService {

  constructor(private httpClient: HttpClient) { }

  public apiUrl = " https://lcs.mockable.io";
  public getLocations(userEmail: string, userTimezone: string, userLocale: string){
    return this.httpClient.get(this.apiUrl+"/locations?userEmail="+userEmail+"?userTimezone="+userTimezone+"?userLocale="+userLocale);
  }

  public getEquipments(userEmail: string, userTimezone: string, userLocale: string){
    return this.httpClient.get(this.apiUrl+"/equipments?userEmail="+userEmail+"?userTimezone="+userTimezone+"?userLocale="+userLocale);
  }

  public getResourceProfiles(userEmail: string, userTimezone: string, userLocale: string){
    return this.httpClient.get(this.apiUrl+"/resource_profiles?userEmail="+userEmail+"?userTimezone="+userTimezone+"?userLocale="+userLocale);
  }

  public getResources(start: string, end: string, userEmail: string, userTimezone: string, userLocale: string){
    return this.httpClient.get(this.apiUrl+"/resources?start="+start+"?end="+end+"?userEmail="+userEmail+"?userTimezone="+userTimezone+"?userLocale="+userLocale);
  }

  public getServices(userEmail: string, userTimezone: string, userLocale: string){
    return this.httpClient.get(this.apiUrl+"/services?userEmail="+userEmail+"?userTimezone="+userTimezone+"?userLocale="+userLocale);
  }

  public getBuildings(userEmail: string, userTimezone: string, userLocale: string){
    return this.httpClient.get(this.apiUrl+"/buildings?userEmail="+userEmail+"?userTimezone="+userTimezone+"?userLocale="+userLocale);
  }
}