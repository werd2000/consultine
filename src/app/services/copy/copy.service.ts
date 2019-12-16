import { Injectable } from '@angular/core';
declare const $;
// import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class CopyService {

  public header = [];
  public footer = [];
  public data;
  public encabezado: string[];
  public title: string;
  public messageTop: string;
  public messageBottom: string;
  private _body = '';
  private _output;

  constructor() { }

  _newLine() {
    return navigator.userAgent.match(/Windows/) ? '\r\n' : '\n';
  }

  exportarDatos() {
    this._body = '';
    this._body += this._crearEncabezado() + this._newLine();
    for (const item of this.data) {
      const linea = [];
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const element = item[key];
          linea.push(element);
        }
      }
      this._body += (linea.join('\t') + this._newLine());
    }
  }

  private _crearEncabezado() {
    const head = [];
    for (const enc of this.encabezado) {
      head.push(enc);
    }
    return head.join('\t');
  }

  copiar() {
    const hiddenDiv = $('<div/>')
      .css( {
        height: 1,
        width: 1,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0
      } );

    this._output = this._body;

    if ( this.title ) {
      this._output = this.title + this._newLine() + this._newLine() + this._output;
    }

    if ( this.messageTop ) {
      this._output = this.messageTop + this._newLine() + this._newLine() + this._output;
    }

    if ( this.messageBottom ) {
      this._output = this._output + this._newLine() + this._newLine() + this.messageBottom;
    }

    
    const textarea = $('<textarea readonly/>')
    .val( this._output )
    .appendTo( hiddenDiv );
    
    // For browsers that support the copy execCommand, try to use it
    if ( document.queryCommandSupported('copy') ) {
      hiddenDiv.appendTo( '.mat-card' );
      textarea[0].focus();
      textarea[0].select();
      
      try {
        const successful = document.execCommand( 'copy' );
        hiddenDiv.remove();
        if (successful) {
          // swal('Datos copiados', 'al portapapeles', 'success',
          //   { timer: 1500, buttons: [false] });
          alert('Datos copiados al portapapeles');
          return;
        }
      } catch (t) {
        console.log(t);
      }
    }
  }
}
