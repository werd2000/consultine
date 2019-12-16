import { Injectable } from '@angular/core';
// import { PacienteProfile } from 'src/app/models/paciente.model';
// import { EmpleadoProfile } from '../../models/empleado.model';
import { PacienteService } from '../paciente/paciente.service';
import { PersonalService } from '../personal/personal.service';


@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(
    public pacienteService: PacienteService,
    public personalService: PersonalService,
  ) { }

  guardarContacto(persona: any, tipo: string) {
    if (tipo === 'paciente') {
      this.pacienteService.updatePaciente(persona);
    }
    if (tipo === 'empleado') {
      this.personalService.updatePersonal(persona);
    }
  }
}
