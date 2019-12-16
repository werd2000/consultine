import { Injectable } from '@angular/core';
declare const $;

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  public header = [];
  public footer = [];
  public data;
  public encabezado;
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
      this._body += (linea.join(',') + this._newLine());
    }
  }

  private _crearEncabezado() {
    const head = [];
    for (const enc of this.encabezado) {
      head.push(enc);
    }
    return head.join(',');
  }

  exportar() {
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
    this._saveAs();
  }

  private _saveAs () {
    const csvFile = new Blob([this._output], {type : 'text/csv'}); // the blob
    // Download link
    const downloadLink = document.createElement('a');

    // File name
    downloadLink.download = 'lista.csv';

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = 'none';

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
  }
}
