import { Pipe, PipeTransform } from '@angular/core';
import { PacienteProfile } from '../models/paciente.model';

@Pipe({
  name: 'nyaPaciente'
})
export class PacientePipe implements PipeTransform {

  transform(paciente: PacienteProfile): any {
    if (!paciente) {
      return;
    }
    return paciente.apellido + ' ' + paciente.nombre;
  }
}
