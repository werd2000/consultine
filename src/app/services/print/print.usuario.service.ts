import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioGooglePipe } from '../../pipes/usuario-google.pipe';
declare const $;

@Injectable({
  providedIn: 'root'
})
export class PrintUsuarioService {

  private lista: string;
  private thead: string;
  public titulo: string;
  public win;

  constructor() { }

  crearFichaUsuario( usuario: Usuario, titulo: string ) {
    // Construct a table for printing
    this.lista = '<div class="container">';
    this.lista += '<h3 class="text-center bg-primary text-white">' + titulo + '</h3>';

    this.lista += '<table class="table">';
    this.lista += '<tbody>';
    this.lista += '<tr>';
    if (usuario.img) {
      this.lista += '<td rowspan="8" class="w-25"><img src="' + usuario.img + '"></td>';
    } else {
      // tslint:disable-next-line: max-line-length
      this.lista += '<td rowspan="8" class="w-25"><img src="https://firebasestorage.googleapis.com/v0/b/cronosapp-12a92.appspot.com/o/img%2Fpaciente%2Fno-img.jpg?alt=media&token=d4ca67cb-c8aa-4c52-9875-422af63fab34"></td>';
    }
    this.lista += '<td colspan="2"><h1>' + usuario.nombre + '</h1></td>';
    this.lista += '</tr>';
    this.lista += '<tr>';
    this.lista += '<td>Email</td>';
    this.lista += '<td><h5>' + usuario.email + '</h5></td>';
    this.lista += '</tr>';
    this.lista += '<tr>';
    this.lista += '<td>Role</td>';
    this.lista += '<td><h5>' + usuario.role + '</h5></td>';
    this.lista += '</tr>';
    this.lista += '<tr>';
    this.lista += '<td>Usuario de Google</td>';
    this.lista += '<td><h5>' + usuario.google + '</h5></td>';
    this.lista += '</tr>';
    return this.lista;
  }

}
