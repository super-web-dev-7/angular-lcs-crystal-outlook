import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "filter"
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

    return itemsFiltered;
  }
}

// Angular pipe to filter out resource profiles based on search value
