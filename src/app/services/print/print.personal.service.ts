import { Injectable } from '@angular/core';
// import { EmpleadoProfile } from 'src/app/models/empleado.model';
import { Turno } from 'src/app/models/turno.model';
import { TurnoInterface } from 'src/app/interfaces/turno.interface';
import { EmpleadoInterface } from 'src/app/interfaces/empleado.interface';
declare const $;

@Injectable({
  providedIn: 'root'
})
export class PrintPersonalService {

  private ficha: string;
  private thead: string;
  public titulo: string;
  public win;

  constructor() { }

  crearFichaPersonal( empleado: EmpleadoInterface) {
    this.ficha = this.crearContenedorTabla(`${empleado.apellido} ${empleado.nombre}`);

    this.ficha += this.imprimirPrincipal(empleado);
    this.ficha += this.imprimirDomicilio(empleado);
    this.ficha += this.imprimirContactos(empleado);
    this.ficha += this.imprimirDatosFamiliares(empleado);
    this.ficha += this.imprimirSSocial(empleado);

    this.ficha += this.crearFinTabla();
    return this.ficha;
  }

  crearContenedorTabla(titulo: string) {
    let html = '<div class="container">';
    html += '<h2 class="text-center bg-secondary text-white"> DATOS de ' + titulo + '</h2>';
    html += '<table class="table table-sm">';
    html += '<tbody>';
    return html;
  }

  crearFinTabla() {
    let html = '</tbody>';
    html += '</table>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  imprimirPrincipal(empleado: EmpleadoInterface) {
    let html = '<tr>';
    if (empleado.img) {
      html += '<td rowspan="8" style="width: 25%">';
      html += '<img src="' + empleado.img + '" style="width:100%"></td>';
    } else {
      // tslint:disable-next-line: max-line-length
      html += '<td rowspan="8" class="w-25"><img src="https://firebasestorage.googleapis.com/v0/b/cronosapp-12a92.appspot.com/o/img%2Fpaciente%2Fno-img.jpg?alt=media&token=d4ca67cb-c8aa-4c52-9875-422af63fab34"></td>';
    }
    html += '</tr>';
    html += '<tr>';
    html += '<td>Nacionalidad</td>';
    html += '<td colspan="2"><h5>' + empleado.nacionalidad + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Nro de Doc.</td>';
    html += '<td colspan="2"><h5>' + empleado.nroDoc + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Fecha Nacimiento</td>';
    html += '<td colspan="2"><h5>' + empleado.fechaNac + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Sexo</td>';
    html += '<td colspan="2"><h5>' + empleado.sexo + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Fecha Ingreso</td>';
    html += '<td colspan="2"><h5>' + empleado.fechaAlta + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Fecha Egreso</td>';
    html += '<td colspan="2"><h5>' + empleado.fechaBaja + '</h5></td>';
    html += '</tr>';
    html += '<tr>';
    if (empleado.observaciones) {
      html += '<td colspan="3">' + empleado.observaciones + '</td>';
    }
    html += '</tr>';
    return html;
  }

  imprimirDomicilio(empleado: EmpleadoInterface) {
    let html = '<tr>';
    html += '<td colspan="4"><h4 class="text-center bg-secondary text-white">Domicilio</h4></td>';
    html += '</tr>';
    if (empleado.domicilio) {
      html += '<tr>';
      html += '<td>Calle:</td>';
      html += '<td><h5>' + empleado.domicilio.calle + '</h5></td>';
      html += '<td>Casa Nº:</td>';
      html += '<td><h5>' + empleado.domicilio.casa + '</h5></td>';
      html += '</tr>';
      html += '<tr>';
      html += '<td>Barrio:</td>';
      html += '<td><h5>' + empleado.domicilio.barrio + '</h5></td>';
      html += '<td>C.P.:</td>';
      html += '<td><h5>' + empleado.domicilio.cp + '</h5></td>';
      html += '</tr>';
      html += '<tr>';
      html += '<td>Ciudad:</td>';
      html += '<td><h5>' + empleado.domicilio.ciudad + '</h5></td>';
      html += '<td>Provincia:</td>';
      html += '<td><h5>' + empleado.domicilio.provincia + '</h5></td>';
      html += '</tr>';
      html += '<tr>';
      html += '<td>País:</td>';
      html += '<td><h5>' + empleado.domicilio.pais + '</h5></td>';
      // html += '<td>Lat - Lng:</td>';
      // html += '<td><h5>' + empleado.domicilio.lat + - + empleado.domicilio.lng + '</h5></td>';
      html += '</tr>';
    } else {
      html += '<td colspan="3">No hay datos aún.</td>';
    }
    return html;
  }

  imprimirContactos(empleado: EmpleadoInterface) {
    let html = '<tr>';
    html += '<td colspan="4"><h4 class="text-center bg-secondary text-white">Contactos</h4></td>';
    html += '</tr>';
    if (empleado.contactos) {
      empleado.contactos.forEach(contacto => {
        html += '<tr>';
        html += '<td><h5>' + contacto.tipo + '</h5></td>';
        html += '<td><h5>' + contacto.valor + '</h5></td>';
        if (contacto.observaciones === null) {
          html += '<td colspan="2"></td>';
        } else {
          html += '<td colspan="2">' + contacto.observaciones + '</td>';
        }
        html += '</tr>';
      });
    } else {
      html += '<td colspan="3">No hay datos aún.</td>';
    }
    html += '</tr>';
    return html;
  }

  imprimirDatosFamiliares(empleado: EmpleadoInterface) {
    let html = '<tr>';
    html += '<td colspan="4"><h4 class="text-center bg-secondary text-white">Datos familiares</h4></td>';
    html += '</tr>';
    if (empleado.familiares) {
      empleado.familiares.forEach(familia => {
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

  imprimirSSocial(empleado: EmpleadoInterface) {
    let html = '<tr>';
    html += '<td colspan="4"><h4 class="text-center bg-secondary text-white">Obra Social</h4></td>';
    html += '</tr>';
    if (empleado.ssocial) {
        html += '<tr>';
        if (empleado.ssocial.obrasocial === undefined) {
          html += '<td colspan="2"><h5>No hay datos de la Obra Social</h5></td>';
        } else {
          html += '<td colspan="2"><h5>' + empleado.ssocial.obrasocial + '</h5></td>';
        }
        if (empleado.ssocial.nafiliado === undefined ) {
          html += '<td colspan="2"><h5>No hay datos de afiliación</h5></td>';
        } else {
          html += '<td colspan="2"><h5>' + empleado.ssocial.nafiliado + '</h5></td>';
        }
        html += '</tr>';
    } else {
      html += '<td colspan="3">No hay datos aún.</td>';
    }
    html += '</tr>';
    return html;
  }

  crearListaPersonal(listado: EmpleadoInterface[]) {
    let html = '';
    for (const item of listado) {
      html += '<tr>';
      if (item.img === undefined) {
        html += '<td class=""><img src="" class="h-25 w-25"></td>';
      } else {
        html += '<td class=""><img src="' + item.img + '" width="40px"></td>';
      }
      html += '<td>' + item.apellido + '</td>';
      html += '<td>' + item.nombre + '</td>';
      html += '<td>' + item.nroDoc + '</td>';
      html += '<td>' + item.fechaNac + '</td>';
      html += '</tr>';
    }
    return html;
  }

  crearListaTurnosPersonal(personal: EmpleadoInterface, listado: TurnoInterface[]) {

    let html = this.crearContenedorTabla( 'TURNOS DE ' + `${personal.apellido} ${personal.nombre}`);
    for (const item of listado) {
      html += '<tr>';
      html += '<td>' + item.fechaInicio + '</td>';
      html += '<td>' + item.paciente.apellido + '</td>';
      html += '<td>' + item.duracion + '</td>';
      html += '<td>' + item.estado + '</td>';
      html += '</tr>';
    }
    html += this.crearFinTabla();
    return html;
  }

}
