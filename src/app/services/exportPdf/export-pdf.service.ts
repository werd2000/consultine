import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from '../empresa/empresa.service';
import { logoEmmpresa } from 'src/app/config/config';


@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {

  public establecimiento: Empresa;
  public doc: jsPDF;
  public datos;

  constructor(
    private empresaService: EmpresaService
  ) {
    this.establecimiento = this.empresaService.establecimiento;
    this.doc = new jsPDF();
  }

  setEncabezado() {
    if (this.establecimiento) {
      this.doc.addImage(logoEmmpresa, 'JPEG', 20, 6, 30, 30);
      this.doc.setFontSize(11);
      this.doc.setFontStyle('bold');
      this.doc.text('de ' + this.establecimiento.nombre, 53, 18);
      this.doc.setFontSize(9);
      this.doc.setFontStyle('normal');
      // this.doc.text('Instituto de Educación Pública de Gestión Privada', 53, 18);
      this.doc.text('Pasaje Brasil 2798', 53, 22);
      this.doc.text('Tel.:(376)4439049', 53, 26);
      this.doc.line(20, 28, 190, 28);
    }
  }

  setTitle(title: string) {
    this.doc.setFontSize(18);
    this.doc.setFontStyle('bold');
    this.doc.text(title, 105, 44, 'center' );
  }

  crearLista(lista: any) {
    this.doc.setFontSize(10);
    this.doc.line(20, 49, 190, 49);
    this.doc.text('Nº', 20, 55);
    this.doc.text('Apellido', 30, 55);
    this.doc.text('Nombre', 65, 55);
    this.doc.text('Doc.', 120, 55);
    this.doc.text('F.Nac', 155, 55);
    this.doc.line(20, 58, 190, 58);
    this.doc.setFontStyle('normal');
    let linea = 65;
    let nro = 1;
    for (const item of lista) {
      this.doc.text(nro.toString(), 20, linea.toString());
      this.doc.text(item.apellido, 30, linea.toString());
      this.doc.text(item.nombre, 65, linea.toString());
      this.doc.text(item.tipo_doc + ': ' + item.nro_doc, 120, linea.toString());
      this.doc.text(item.fecha_nac + '', 155, linea.toString());
      linea += 10;
      nro += 1;
    }
  }

  crearListaAreas(lista: any) {
    this.doc.setFontSize(10);
    this.doc.line(20, 49, 190, 49);
    this.doc.text('Nº', 20, 55);
    this.doc.text('Área', 30, 55);
    this.doc.text('Observaciones', 85, 55);
    this.doc.line(20, 58, 190, 58);
    this.doc.setFontStyle('normal');
    let linea = 65;
    let nro = 1;
    for (const item of lista) {
      this.doc.text(nro.toString(), 20, linea.toString());
      this.doc.text(item.area, 30, linea.toString());
      this.doc.text(item.observaciones, 85, linea.toString());
      linea += 10;
      nro += 1;
    }
  }

  crearListaUsuarios(lista: any) {
    this.doc.setFontSize(11);
    this.doc.line(20, 49, 190, 49);
    this.doc.text('Nº', 20, 55);
    this.doc.text('Email', 28, 55);
    this.doc.text('Nombre', 90, 55);
    this.doc.text('Role', 135, 55);
    this.doc.text('Google', 165, 55);
    this.doc.line(20, 58, 190, 58);
    this.doc.setFontStyle('normal');
    let linea = 65;
    let nro = 1;
    for (const item of lista) {
      this.doc.text(nro.toString(), 20, linea.toString());
      this.doc.text(item.email, 28, linea.toString());
      this.doc.text(item.nombre, 90, linea.toString());
      this.doc.text(item.role, 135, linea.toString());
      this.doc.text(item.google + '', 165, linea.toString());
      linea += 10;
      nro += 1;
    }
  }

  crearListaTurnosPaciente(lista: any) {
    this.doc.setFontSize(10);
    this.doc.line(20, 49, 190, 49);
    this.doc.text('Nº', 20, 55);
    this.doc.text('Fecha', 28, 55);
    this.doc.text('Área', 50, 55);
    this.doc.text('Profesional', 90, 55);
    this.doc.text('Duración', 150, 55);
    this.doc.text('Estado', 170, 55);
    this.doc.line(20, 58, 190, 58);
    this.doc.setFontStyle('normal');
    let linea = 65;
    let nro = 1;
    for (const item of lista) {
      this.doc.text(nro.toString(), 20, linea.toString());
      this.doc.text(item.fechaInicio, 28, linea.toString());
      this.doc.text(item.area, 50, linea.toString());
      this.doc.text(item.profesional.apellido + ' ' + item.profesional.nombre, 90, linea.toString());
      this.doc.text(item.duracion + '', 150, linea.toString());
      this.doc.text(item.estado + '', 170, linea.toString());
      linea += 10;
      nro += 1;
    }
  }

  crearListaTurnosProfesional(lista) {
    this.doc.setFontSize(10);
    this.doc.line(20, 49, 190, 49);
    this.doc.text('Nº', 20, 55);
    this.doc.text('Fecha', 28, 55);
    this.doc.text('Paciente', 55, 55);
    this.doc.text('Duración', 118, 55);
    this.doc.text('Estado', 140, 55);
    this.doc.line(20, 58, 190, 58);
    this.doc.setFontStyle('normal');
    let linea = 65;
    let nro = 1;
    for (const item of lista) {
      this.doc.text(nro.toString(), 20, linea.toString());
      this.doc.text(item.fechaInicio, 28, linea.toString());
      this.doc.text(item.paciente.apellido, 55, linea.toString());
      this.doc.text(item.duracion + '', 118, linea.toString());
      this.doc.text(item.estado + '', 140, linea.toString());
      linea += 10;
      nro += 1;
    }
  }

  guardar(nombreArchivo: string) {
    this.doc.save( nombreArchivo);
  }
}
