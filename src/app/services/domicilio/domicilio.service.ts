import { Injectable } from '@angular/core';
import { PacienteService } from '../paciente/paciente.service';
import { PersonalService } from '../personal/personal.service';

@Injectable({
  providedIn: 'root'
})
export class DomicilioService {

  constructor(
    public pacienteService: PacienteService,
    public personalService: PersonalService,
  ) { }

  guardarDomicilio(persona: any, tipo: string) {
    if (tipo === 'paciente') {
      this.pacienteService.updatePaciente(persona);
    }
    if (tipo === 'empleado') {
      this.personalService.updatePersonal(persona);
    }
  }
}
