import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrystalService {

  constructor(private httpClient: HttpClient) { }

  public apiUrl = " https://lcs.mockable.io";
  public getLocations(){
    return this.httpClient.get(this.apiUrl+"/locations");
  }

  public getEquipments(){
    return this.httpClient.get(this.apiUrl+"/equipments");
  }

  public getResourceProfiles(){
    return this.httpClient.get(this.apiUrl+"/resource_profiles");
  }

  public getResources(){
    return this.httpClient.get(this.apiUrl+"/resources");
  }

  public getServices(){
    return this.httpClient.get(this.apiUrl+"/services");
  }

  public getBuildings(){
    return this.httpClient.get(this.apiUrl+"/buildings");
  }
}
