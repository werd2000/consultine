import { Injectable } from '@angular/core';
import { Area } from 'src/app/models/area.model';
declare const $;

@Injectable({
  providedIn: 'root'
})
export class PrintAreaService {

  private lista: string;
  private thead: string;
  public titulo: string;
  public win;

  constructor() { }

  crearFichaArea( area: Area, titulo: string ) {
    // Construct a table for printing
    this.lista = '<div class="container">';
    this.lista += '<h3 class="text-center bg-primary text-white">' + titulo + '</h3>';
    this.lista += '<table class="table">';
    this.lista += '<tbody>';
    this.lista += '<tr>';
    this.lista += '<td><h1>' + area.area + '</h1></td>';
    this.lista += '</tr>';
    this.lista += '<tr>';
    this.lista += '<td>Observaciones</td>';
    this.lista += '</tr>';
    this.lista += '<tr>';
    this.lista += '<td><h5>' + area.observaciones + '</h5></td>';
    this.lista += '</tr>';
    return this.lista;
  }

  crearListaArea(listado: Area[]) {
    let lista = '';
    for (const item of listado) {
        lista += '<tr>';
        lista += '<td>' + item.area + '</td>';
        lista += '<td>' + item.observaciones + '</td>';
        lista += '</tr>';
    }
    return lista;
  }

}
