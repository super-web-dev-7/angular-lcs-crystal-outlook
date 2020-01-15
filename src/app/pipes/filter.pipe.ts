import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchParams): any[] {
    if(!items) return [];
    let itemsFilteredByCapacity = items.filter(item => item.capacity >= searchParams.capacity);
    if(!searchParams.searchValue) return itemsFilteredByCapacity;
    searchParams.searchValue = searchParams.searchValue.toLowerCase();
return itemsFilteredByCapacity.filter( item => {
      return item.name.toLowerCase().includes(searchParams.searchValue);
    });
   }
}

// Angular pipe to filter out resource profiles based on search value