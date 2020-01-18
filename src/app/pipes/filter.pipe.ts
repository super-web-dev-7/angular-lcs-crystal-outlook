import { Pipe, PipeTransform } from "@angular/core";
import { filter } from 'rxjs/operators';
@Pipe({
  name: "filter",
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchParams): any[] {

    if (!items) return [];
    let itemsFiltered = items.filter(
      item => item.capacity >= searchParams.capacity
    );

    if (searchParams.searchValue) {
      searchParams.searchValue = searchParams.searchValue.toLowerCase();
      itemsFiltered = itemsFiltered.filter(item => {
        return item.name.toLowerCase().includes(searchParams.searchValue);
      });
    }

     if (searchParams.equipments.length > 0) {
      searchParams.equipments.forEach(equipment => {
        itemsFiltered = itemsFiltered.filter(
          item => { 
            let match = 0;
            item.equipments.forEach(element => {
              if(element.id == equipment.id)
                match++;
            });
            return match > 0;
          });
      });
    }

    if (searchParams.services.length > 0) {
      searchParams.services.forEach(service => {
        itemsFiltered = itemsFiltered.filter(
          item => { 
            return item.services.includes(service.name);
          });
      });
    }

    if (searchParams.resourceProfiles) {
        itemsFiltered = itemsFiltered.filter(
          item => { 
            return item.type.id == searchParams.resourceProfiles.id;
          });
    }

    if (searchParams.location[0] !== "") {
      let filterLevels = 1;
      let locationLevels = searchParams.location.length;
      while(filterLevels <= locationLevels && searchParams.location[filterLevels-1] != ""){
        filterLevels++;
      };
      filterLevels--;
      itemsFiltered = itemsFiltered.filter(item => {
        let location = item.location;
        for(let i=0; i<filterLevels; i++){
          if(location.id == searchParams.location[i].id){
            if(i == (filterLevels-1)){
              return true;
            }
            else if(location.children && location.children.id){
              location = location.children;
            }
            else{
              return false;
            }
          }
          else{
            return false;
          }
        }
        return true;
      });
    }

    return itemsFiltered;
  }
}

// Angular pipe to filter out resource profiles based on search value
