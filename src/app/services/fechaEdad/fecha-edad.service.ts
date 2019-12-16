import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

@Injectable({
  providedIn: 'root'
})
export class FechaEdadService {

  edadAnios: number;
  edadMeses: number;
  hoy = new Date();

  constructor() { }

  calcularEdad( fechaNac, fechaActual = null) {
    // const years = moment().diff(fechaNac, 'years');
    // console.log('fechaNac', years);
    // return moment(fechaNac, 'YYYYMMDD').fromNow(true);
    return moment().diff(fechaNac, 'years') + ' años';
  }

  // calcularEdadMeses( fechaEvaluacion, fechaNac ) {
  //   let meses = fechaEvaluacion.diff(fechaNac, 'months');
  //   if (this.edadEvaluacion['anios'] > 0 ) {
  //     meses = meses - this.edadEvaluacion['anios'] * 12;
  //   }
  //   return Math.trunc(meses);
  // }

  // calcularEdadDias( fechaEvaluacion, fechaNac ) {
  //   let dias = fechaEvaluacion.diff(fechaNac, 'days');
  //   console.log(dias);
  //   if (this.edadEvaluacion['anios'] > 0 ) {
  //     dias = dias - this.edadEvaluacion['anios'] * 365;
  //     console.log(dias);
  //   }
  //   if (this.edadEvaluacion['meses'] > 0 ) {
  //     dias = dias - this.edadEvaluacion['meses'] * 30;
  //   }
  //   return Math.trunc(dias);
  // }

  getFechaBd(fecha) {
    let mes = '';
    const hoy = fecha;
    if (hoy.getMonth() + 1 <= 9) {
      mes = '0' + (hoy.getMonth() + 1);
    } else {
      mes = (hoy.getMonth() + 1).toString();
    }
    const fechabd = hoy.getFullYear() + '-' + mes + '-' + hoy.getDate();
    return fechabd;
  }
}
