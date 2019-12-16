import { Pipe, PipeTransform } from '@angular/core';
import { Profesion } from '../models/profesion.model';

@Pipe({
  name: 'areaProfesional'
})
export class AreaProfesionalPipe implements PipeTransform {

  transform(profesion): any {

    const salida: string[] = [];

    if (!profesion) {
      return;
    }

    if (profesion.profesiones.length === 0) {
        return;
    }

    for (let index = 0; index < profesion.profesiones.length; index++) {
        const element = profesion.profesiones[index];
        salida.push(element.area);
    }

    return salida.join(' - ');

  }

}
