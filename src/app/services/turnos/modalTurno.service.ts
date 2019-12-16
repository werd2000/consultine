import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalTurnoService {

  public oculto = 'hide';

  constructor() { }

  mostrarModal() {
    this.oculto = '';
  }

  ocultarModal() {
    this.oculto = 'hide';
  }
}