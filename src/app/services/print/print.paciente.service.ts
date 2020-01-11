import { Injectable } from '@angular/core';
// import { PacienteProfile } from 'src/app/models/paciente.model';
import * as moment from 'moment';
import { PacienteInterface } from 'src/app/interfaces/paciente.interface';
declare const $;

@Injectable({
  providedIn: 'root'
})
export class PrintPacienteService {

  private lista: string;
  private thead: string;
  public titulo: string;
  public win;
  private ficha: string;

  constructor() { }

  crearFichaPaciente( paciente: PacienteInterface ) {
    this.ficha = this.crearContenedorLista(`${paciente.apellido} ${paciente.nombre}`);

    this.ficha += this.imprimirPrincipal(paciente);

    this.ficha += this.imprimirDomicilio(paciente);
    this.ficha += this.imprimirContactos(paciente);
    this.ficha += this.imprimirDatosFamiliares(paciente);
    this.ficha += this.imprimirSSocial(paciente);

    this.ficha += this.crearFinContenedorLista();
    return this.ficha;
  }

  crearContenedorLista(titulo: string) {
    let html = '<div class="container">';
    html += '<h2 class="text-center bg-secondary text-white"> DATOS de ' + titulo + '</h2>';
    html += '<table class="table table-sm">';
    html += '<tbody>';
    return html;
  }

  crearFinContenedorLista() {
    let html = '</tbody>';
    html += '</table>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  imprimirPrincipal(paciente: PacienteInterface) {
    let html = '<tr>';
    if (paciente.img) {
      html += '<td rowspan="8" style="width: 25%">';
      html += '<img src="' + paciente.img + '" style="width: 100%"></td>';
    } else {
      // tslint:disable-next-line: max-line-length
      html += '<td rowspan="8" class="w-25"><img src="https://firebasestorage.googleapis.com/v0/b/cronosapp-12a92.appspot.com/o/img%2Fpaciente%2Fno-img.jpg?alt=media&token=d4ca67cb-c8aa-4c52-9875-422af63fab34"></td>';
    }
    // this.lista += '<td colspan="3"><h2>' + paciente.getNombreCompleto() + '</h2></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Nacionalidad</td>';
    html += '<td colspan="2"><h5>' + paciente.nacionalidad + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Nro de Doc.</td>';
    html += '<td colspan="2"><h5>' + paciente.nroDoc + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Fecha Nacimiento</td>';
    html += '<td colspan="2"><h5>' + paciente.fechaNac + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Sexo</td>';
    html += '<td colspan="2"><h5>' + paciente.sexo + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Fecha Ingreso</td>';
    if (paciente.fechaAlta === undefined) {
      html += '<td colspan="2"><h5>-</h5></td>';
    } else {
      html += '<td colspan="2"><h5>' + paciente.fechaAlta + '</h5></td>';
    }
    html += '</tr>';
    html += '<tr>';
    html += '<td>Fecha Egreso</td>';
    if (paciente.fechaBaja === undefined) {
      html += '<td colspan="2"><h5>-</h5></td>';
    } else {
      html += '<td colspan="2"><h5>' + paciente.fechaBaja + '</h5></td>';
    }
    html += '</tr>';
    html += '<tr>';
    html += '<td>Estado</td>';
    html += '<td colspan="2"><h5>' + paciente.estado + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    if (paciente.observaciones) {
      html += '<td colspan="3">' + paciente.observaciones + '</td>';
    }
    html += '</tr>';
    return html;
  }

  imprimirDomicilio(paciente: PacienteInterface) {
    let html = '<tr>';
    html += '<td colspan="4"><h4 class="text-center bg-secondary text-white">Domicilio</h4></td>';
    html += '</tr>';
    if (paciente.domicilio) {
      html += '<tr>';
      html += '<td>Calle:</td>';
      html += '<td><h5>' + paciente.domicilio.calle + '</h5></td>';
      html += '<td>Casa Nº:</td>';
      html += '<td><h5>' + paciente.domicilio.casa + '</h5></td>';
      html += '</tr>';
      html += '<tr>';
      html += '<td>Barrio:</td>';
      html += '<td><h5>' + paciente.domicilio.barrio + '</h5></td>';
      html += '<td>C.P.:</td>';
      html += '<td><h5>' + paciente.domicilio.cp + '</h5></td>';
      html += '</tr>';
      html += '<tr>';
      html += '<td>Ciudad:</td>';
      html += '<td><h5>' + paciente.domicilio.ciudad + '</h5></td>';
      html += '<td>Provincia:</td>';
      html += '<td><h5>' + paciente.domicilio.provincia + '</h5></td>';
      html += '</tr>';
      html += '<tr>';
      html += '<td>País:</td>';
      html += '<td><h5>' + paciente.domicilio.pais + '</h5></td>';
      html += '</tr>';
    } else {
      html += '<td colspan="3">No hay datos aún.</td>';
    }
    return html;
  }

  imprimirContactos(paciente: PacienteInterface) {
    let html = '<tr>';
    html += '<td colspan="4"><h4 class="text-center bg-secondary text-white">Contactos</h4></td>';
    html += '</tr>';
    if (paciente.contactos) {
      paciente.contactos.forEach(contacto => {
        html += '<tr>';
        html += '<td><h5>' + contacto.tipo + '</h5></td>';
        html += '<td><h5>' + contacto.valor + '</h5></td>';
        html += '<td colspan="2">' + contacto.observaciones + '</td>';
        html += '</tr>';
      });
    } else {
      html += '<td colspan="3">No hay datos aún.</td>';
    }
    html += '</tr>';
    return html;
  }

  imprimirDatosFamiliares(paciente: PacienteInterface) {
    let html = '<tr>';
    html += '<td colspan="4"><h4 class="text-center bg-secondary text-white">Datos familiares</h4></td>';
    html += '</tr>';
    if (paciente.familiares) {
      paciente.familiares.forEach(familia => {
        html += '<tr>';
        html += '<td><h5>' + familia.relacion + '</h5></td>';
        html += '<td><h5>' + familia.apellido + '</h5></td>';
        html += '<td><h5>' + familia.nombre + '</h5></td>';
        html += '<td><h5>' + familia.nroDoc + '</h5></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td colspan="4">' + familia.observaciones + '</td>';
        html += '</tr>';
      });
    } else {
      html += '<td colspan="3">No hay datos aún.</td>';
    }
    html += '</tr>';
    return html;
  }

  imprimirSSocial(paciente: PacienteInterface) {
    let html = '<tr>';
    html += '<td colspan="4"><h4 class="text-center bg-secondary text-white"  >Obra Social</h4></td>';
    html += '</tr>';
    if (paciente.ssocial) {
        html += '<tr>';
        html += '<td colspan="2"><h5>' + paciente.ssocial.obrasocial + '</h5></td>';
        html += '<td colspan="2"><h5>' + paciente.ssocial.nafiliado + '</h5></td>';
        html += '</tr>';
    } else {
      html += '<td colspan="3">No hay datos aún.</td>';
    }
    html += '</tr>';
    return html;
  }

  crearListaPacientes(listado: PacienteInterface[]) {
    let html = '';
    for (const item of listado) {
      html += '<tr>';
      if (item.img === undefined) {
        html += '<td class=""><img src="" class="h-25"></td>';
      } else {
        html += '<td class=""><img src="' + item.img + '" class="h-25"></td>';
      }
      html += '<td>' + item.apellido + '</td>';
      html += '<td>' + item.nombre + '</td>';
      html += '<td>' + item.nroDoc + '</td>';
      html += '<td>' + item.fechaNac + '</td>';
      html += '</tr>';
    }
    return html;
  }

  crearListaTurnosPaciente(paciente, listado) {
    let html = this.crearContenedorLista( 'TURNOS DE ' + paciente.getNombreCompleto());
    for (const item of listado) {
      html += '<tr>';
      html += '<td>' + item.fechaInicio + '</td>';
      html += '<td>' + item.area + '</td>';
      html += '<td>' + item.profesional.apellido + '</td>';
      html += '<td>' + item.duracion + '</td>';
      html += '<td>' + item.estado + '</td>';
      html += '</tr>';
    }
    html += this.crearFinContenedorLista();
    return html;
  }

  imprimirConstanciaTratamiento(cuerpo: string) {
    let html = '<div class="container"><div class="row justify-content-md-center"><div class="col-10">';
    html += '<br><br><br><br><br><br>';
    html += '<h1 class="text-center"> Constancia de tratamiento </h1>';
    html += '<hr><br><br>';
    html += `<h4 class="text-right">Posadas, ${moment().format('dddd D MMMM YYYY')}</h4>`;
    html += '<br>';
    html += '<h5 class="text-justify">' + cuerpo + '</h5>';
    html += '</div></div></div>';
    return html;
  }

}
