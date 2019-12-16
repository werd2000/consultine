import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoPaciente'
})
export class EstadoPacientePipe implements PipeTransform {

  transform(estado: string): any {

    if (!estado) {
      return;
    }

    switch (estado) {
      case 'ESPERA':
        return 'far fa-clock animated flash slower infinite danger';
        // break;

      case 'EVALUACION':
        return 'fas fa-eye animated pulse fast infinite warning';
        // break;

      case 'DEVOLUCION':
        return 'fas fa-hands-helping animated rubberBand slow infinite primary';
        // break;

      case 'TRATAMIENTO':
        return 'fas fa-medkit';
        // break;

      case 'ALTA':
        return 'far fa-check-square success';
        // break;

      default:
        return 'fas fa-pause animated flash slow fadeIn';
        // break;
    }
  }

}
