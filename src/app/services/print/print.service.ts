import { Injectable } from '@angular/core';
import { PacienteProfile } from 'src/app/models/paciente.model';
import { EmpleadoProfile } from '../../models/empleado.model';
import { Usuario } from 'src/app/models/usuario.model';
import { PrintUsuarioService } from './print.usuario.service';
import { PrintPersonalService } from './print.personal.service';
import { PrintPacienteService } from './print.paciente.service';
import { PrintAreaService } from './print.area.service';
import { Area } from 'src/app/models/area.model';
import { TurnoInterface } from 'src/app/interfaces/turno.interface';
declare const $;

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  private lista: string;
  private thead: string;
  public titulo: string;
  public win;

  constructor(
    public printUsuarioService: PrintUsuarioService,
    public printPersonalService: PrintPersonalService,
    public printPacienteService: PrintPacienteService,
    public printAreaService: PrintAreaService
  ) { }

  crearEncabezadoLista(encabezado: string[]) {
    // Construct a table for printing
    this.lista = '<div class="container">';
    this.lista += '<div class="table-responsive">';
    this.lista += '<h1>' + this.titulo + '</h1>';
    this.lista += '<table class="table">';
    this.lista += this._crearThead(encabezado);
    this.lista += '<tbody>';
  }

  crearFinLista(listado: any[], tipo: string) {
    this.lista += '<tfoot>Un total de ' + listado.length + ' ' + tipo + '</tfoot>';
    this.lista += '</tbody>';
    this.lista += '</table>';
    this.lista += '</div>';
    this.lista += '</div>';
  }

  // PACIENTES
  crearListaPacientes(encabezado: string[], listado: PacienteProfile[]) {
    this.crearEncabezadoLista(encabezado);
    this.lista += this.printPacienteService.crearListaPacientes(listado);
    this.crearFinLista(listado, 'pacientes');
  }

  crearFichaPaciente( paciente: PacienteProfile ) {
    this.lista = this.printPacienteService.crearFichaPaciente(paciente);
  }

  listaTurnosPaciente( paciente: PacienteProfile, turnos: TurnoInterface[] ) {
    this.lista = this.printPacienteService.crearListaTurnosPaciente(paciente, turnos);
  }

  crearConstanciaTratamiento( texto: string ) {
    console.log(texto);
    this.lista = this.printPacienteService.imprimirConstanciaTratamiento(texto);
  }

  // PERSONAL
  crearListaPersonal(encabezado: string[], listado: EmpleadoProfile[]) {
    this.crearEncabezadoLista(encabezado);
    this.lista += this.printPersonalService.crearListaPersonal(listado);
    this.crearFinLista(listado, 'personal');
  }

  crearFichaPersonal( empleado: EmpleadoProfile ) {
    this.lista = this.printPersonalService.crearFichaPersonal(empleado);
  }

  listaTurnosPersonal( personal: EmpleadoProfile, turnos: TurnoInterface[] ) {
    this.lista = this.printPersonalService.crearListaTurnosPersonal(personal, turnos);
  }

  // Areas
  crearListaAreas(encabezado: string[], listado: Area[]) {
    this.crearEncabezadoLista(encabezado);
    this.lista += this.printAreaService.crearListaArea(listado);
    this.crearFinLista(listado, 'areas');
  }

  crearFichaArea( area: Area, titulo: string ) {
    this.lista = this.printAreaService.crearFichaArea(area, titulo);
  }

  // USUARIOS
  crearListaUsuarios(encabezado: string[], listado: Usuario[]) {
    this.crearEncabezadoLista(encabezado);
    for (const item of listado) {
      this.lista += '<tr>';
      if (item.img === undefined) {
        // tslint:disable-next-line: max-line-length
        this.lista += '<td class=""><img src="https://firebasestorage.googleapis.com/v0/b/cronosapp-12a92.appspot.com/o/img%2Fpaciente%2Fno-img.jpg?alt=media&token=d4ca67cb-c8aa-4c52-9875-422af63fab34" class="h-25"></td>';
      } else {
        this.lista += '<td class=""><img src="' + item.img + '" class="h-25"></td>';
      }
      this.lista += '<td>' + item.email + '</td>';
      this.lista += '<td>' + item.nombre + '</td>';
      this.lista += '<td>' + item.role + '</td>';
      this.lista += '<td>' + item.google + '</td>';
      this.lista += '</tr>';
    }
    this.crearFinLista(listado, 'usuarios');
  }


  private _crearThead( encabezado, estilo = '' ) {
    let thead;
    if (estilo !== '') {
      thead = '<thead style="' + estilo + '"><tr>';
      for (const enc of encabezado) {
        thead += '<th style="' + estilo + '">' + enc + '</th>';
      }
    } else {
      thead = '<thead class="thead-light"><tr>';
      for (const enc of encabezado) {
        thead += '<th>' + enc + '</th>';
      }
    }
    thead += '</tr></thead>';
    return thead;
  }

  imprimir() {
    // Open a new window
    this.win = window.open( '', '' );
    this.win.document.close();
    this.crearHeadPage();
    this.win.document.body.innerHTML = this.lista;
    $(this.win.document.body).addClass('dt-print-view');
    const ventana = this.win;
    ventana.setTimeout( () => {
      ventana.print(); // blocking - so close will not
      ventana.close(); // execute until this is done
    }, 1100 );
  }

  crearHeadPage() {
    let head = `<title> ${ this.titulo } </title>`;
    head += '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css">';
    head += '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">';
    try {
      this.win.document.head.innerHTML = head; // Work around for Edge
    } catch (e) {
      $(this.win.document.head).html( head ); // Old IE
    }
  }

  crearPlanilla(encabezado, asistencias: any) {
    // Construct a table for printing
    this.lista = '<div class="container">';
    this.lista += '<div class="table-responsive">';
    this.lista += `<h1 class="text-center"> ${this.titulo} </h1>`;
    this.lista += '<table class="table" style="border: 1px solid">';
    this.lista += this._crearThead(encabezado, 'border: 1px solid');
    this.lista += '<tbody>';
    for (const item of asistencias) {
      this.lista += '<tr style="border: 1px solid">';
      this.lista += '<td style="border: 1px solid">' + item.fecha + '</td>';
      this.lista += '<td style="border: 1px solid"></td>';
      this.lista += '<td style="border: 1px solid">' + item.area + '</td>';
      this.lista += '<td style="border: 1px solid"></td>';
      this.lista += '</tr>';
    }
    this.lista += '</tbody>';
    this.lista += '</table>';
    this.lista += '</div>';
    this.lista += '</div>';
  }

  imprimirFichaUsuario(usuario: Usuario) {
    this.lista = '' + this.printUsuarioService.crearFichaUsuario(usuario, this.titulo);
  }
}
