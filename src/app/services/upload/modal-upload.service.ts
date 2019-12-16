import { Injectable, EventEmitter } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { PacienteProfile } from 'src/app/models/paciente.model';
import { EmpleadoProfile } from 'src/app/models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  public tipo: string;
  public id: string;
  public objeto: any;
  public oculto = 'hide';
  public notificacion = new EventEmitter<any>();

  constructor() { }

  ocultarModal() {
    this.oculto = 'hide';
    this.tipo = null;
    this.id = null;
  }

  mostrarModal( tipo: string, objeto: Usuario | PacienteProfile | EmpleadoProfile) {
    // console.log('en el modal upload service');
    this.oculto = '';
    this.tipo = tipo;
    // console.log(this.tipo);
    this.id = objeto._id;
    // console.log(this.id);
    this.objeto = objeto;
    // console.log(this.objeto);
  }
}
