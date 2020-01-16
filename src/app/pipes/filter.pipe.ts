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

    return itemsFiltered;
  }
}

// Angular pipe to filter out resource profiles based on search value
