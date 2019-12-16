import { Injectable } from '@angular/core';
import { PacienteService } from '../paciente/paciente.service';
import { PersonalService } from '../personal/personal.service';


@Injectable({
  providedIn: 'root'
})
export class FamiliaService {

  constructor(
    public pacienteService: PacienteService,
    public personalService: PersonalService,
  ) { }

  guardarFamilia(persona: any, tipo: string) {
    if (tipo === 'paciente') {
      this.pacienteService.updatePaciente(persona);
    }
    if (tipo === 'empleado') {
      this.personalService.updatePersonal(persona);
    }
  }
}
