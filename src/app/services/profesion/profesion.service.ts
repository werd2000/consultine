import { Injectable } from '@angular/core';
import { PersonalService } from '../personal/personal.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesionService {

  constructor(
    public personalService: PersonalService,
  ) {
  }

  guardarProfesion(persona: any, tipo: string) {
    if (tipo === 'empleado') {
      this.personalService.updatePersonal(persona);
    }
  }

}
