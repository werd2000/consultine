import { Pipe, PipeTransform } from '@angular/core';
import { EmpleadoProfile } from '../models/empleado.model';

@Pipe({
  name: 'personal'
})
export class PersonalPipe implements PipeTransform {

  transform(personal: EmpleadoProfile, campo: string = 'nya'): any {

    let pers = '';
    if (!personal) {
      return;
    }

    switch ( campo ) {
      case 'nya':
        pers += personal.apellido + ' ' + personal.nombre;
      break;
      case 'profesion':
        let areas = [];
        personal.profesion.forEach(element => {
          areas.push(element.area);
        });
        pers += areas.join(' - ');
        break;
      default:
        pers += personal.apellido + ' ' + personal.nombre;
    }
    return pers;
  }
}
