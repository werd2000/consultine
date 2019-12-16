import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  PacienteService,
  UsuarioService,
  TurnosService,
  PersonalService,
  PrintService,
  ExportPdfService } from 'src/app/services/service.index';
import { PacienteProfile } from 'src/app/models/paciente.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Turno } from 'src/app/models/turno.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import * as moment from 'moment';
import { TurnosFunctions } from 'src/app/pages/turnos/turnos.functions';
import { mergeMap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
})
export class TurnosPacienteComponent implements OnInit, OnDestroy{

  displayedColumns: string[] = [
    'fechaInicio',
    'area',
    'terapeuta',
    'duracion',
    'estado',
    // 'acciones'
  ];
  dataSource: MatTableDataSource<any>;
  cargando: boolean = false;
  cargandoPaciente: boolean = false;
  suscription: Subscription[] = [];
  paciente: PacienteProfile;
  actualizadoPor: Usuario;
  turnosPaciente: any;
  idPaciente: string;
  turnosFunction: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public activatedRoute: ActivatedRoute,
    public pacientesService: PacienteService,
    public route: Router,
    public usuarioService: UsuarioService,
    public turnosService: TurnosService,
    public personalService: PersonalService,
    public printService: PrintService,
    public exportPdfService: ExportPdfService,
    private location: Location,
  ) {
    this.turnosFunction = new TurnosFunctions(
      this.usuarioService,
      this.pacientesService,
      this.personalService
    );
  }

  ngOnInit() {
    this.suscription.push(
      this.activatedRoute.params.subscribe( params => {
        this.idPaciente = params.id;
        this.cargarPaciente(this.idPaciente)
          .subscribe( async (t: any) => {
            this.turnosPaciente = t;
            this.turnosPaciente.sort((a, b) => {
              const x = a.fechaInicio.toLowerCase();
              const y = b.fechaInicio.toLowerCase();
              if (x > y) {return -1; }
              if (x < y) {return 1; }
              return 0;
            });
            await this.turnosPaciente.forEach(this.paraMostrar.bind(this));
            this.cargando = false;
            this.dataSource = new MatTableDataSource(this.turnosPaciente);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          });
      })
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cargarPaciente( id: string ) {
    return this.pacientesService.getPacienteId(id).pipe(
      mergeMap( (pacs: any) => {
      if (pacs === undefined) {
          sweetAlert('Error', 'No se encuentra un paciente con esa identificación', 'warning');
          this.route.navigate(['pacientes']);
        } else {
          this.paciente = new PacienteProfile(
            pacs.apellido,
            pacs.nombre,
            pacs.tipo_doc,
            pacs.nro_doc,
            pacs.nacionalidad,
            pacs.sexo,
            pacs.fecha_nac,
            pacs.estado,
            pacs.fecha_alta,
            pacs.fecha_baja,
            pacs.borrado,
            pacs.domicilio,
            pacs.contactos,
            pacs.ssocial,
            pacs.familiares,
            pacs.img,
            pacs.observaciones,
            pacs.actualizadoEl,
            pacs.actualizadoPor,
            pacs._id
            );
        }

      return this.turnosService.searchTurnos('idPaciente', id);
      })
    );
  }

  cargarTurnos( id: string ) {
    this.cargando = true;
    this.suscription.push(
      this.turnosService.searchTurnos('idPaciente', id)
      .subscribe( async t => {
          this.turnosPaciente = t;
          this.turnosPaciente.sort((a, b) => {
            var x = a.fechaInicio.toLowerCase();
            var y = b.fechaInicio.toLowerCase();
            if (x > y) {return -1; }
            if (x < y) {return 1; }
            return 0;
          });
          await this.turnosPaciente.forEach(this.paraMostrar.bind(this));
          this.dataSource = new MatTableDataSource(this.turnosPaciente);
          this.cargando = false;
        })
    );
  }

  paraMostrar(turno, index, array) {
    // this.getCreador(turno.creadoPor, array, index);
    this.getProfesional(turno.idProfesional, array, index);
    this.getDuracion(turno, array, index);
    // this.getEstilo(turno.estado, array, index);
  }

  private getDuracion(turno, array, index) {
    let inicio = moment(turno.horaInicio, 'HH:mm');
    let fin = moment(turno.horaFin, 'HH:mm');
    array[index].duracion = moment.duration(inicio.diff(fin)).humanize();
  }

  public getCreador(idUsuario: string, array, index) {
    this.usuarioService.getUsuarioId(idUsuario)
        .subscribe( resp => {
          this.cargando = true;
          array[index].usuario = resp;
          this.cargando = false;
        });
  }

  public getProfesional(idProfesional: string, array, index) {
    return this.personalService.getPersonalId(idProfesional)
      .subscribe( resp => {
        this.cargando = true;
        array[index].profesional = resp;
        this.cargando = false;
      });
  }

  ngOnDestroy() {
    this.suscription.forEach(element => {
      element.unsubscribe();
    });
  }

  imprimir() {
    this.printService.titulo = 'Turnos del Paciente';
    this.printService.listaTurnosPaciente( this.paciente, this.turnosPaciente );
    this.printService.imprimir();
  }

  exportarPdf() {
    this.exportPdfService.setEncabezado();
    this.exportPdfService.setTitle('Lista de turnos asignados');
    this.exportPdfService.crearListaTurnosPaciente(this.turnosPaciente);
    this.exportPdfService.guardar('Turnos_de_' + this.paciente.apellido + '.pdf');
    return;
  }

}
