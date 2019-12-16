import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonalService, UsuarioService, TurnosService, PacienteService, PrintService, ExportPdfService, CsvService } from 'src/app/services/service.index';
import { EmpleadoProfile } from 'src/app/models/empleado.model';
import { mergeMap } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import * as moment from 'moment';
import { PacienteProfile } from 'src/app/models/paciente.model';
import { TurnoInterface } from 'src/app/interfaces/turno.interface';

@Component({
  selector: 'app-personal-turnos',
  templateUrl: './personal-turnos.component.html',
})
export class PersonalTurnosComponent implements OnInit {

  displayedColumns: string[] = [
    'fechaInicio',
    'paciente',
    'duracion',
    'estado',
    'acciones'
  ];
  dataSource: MatTableDataSource<any>;
  cargando: boolean = false;
  suscription: Subscription[] = [];
  idPersonal: string;
  personal: EmpleadoProfile;
  actualizadoPor: Usuario;
  turnosProfesional: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public activatedRoute: ActivatedRoute,
    public personalService: PersonalService,
    public route: Router,
    public turnosService: TurnosService,
    public pacienteService: PacienteService,
    public printService: PrintService,
    public exportPdfService: ExportPdfService,
    public csvService: CsvService
  ) { }

  ngOnInit() {
    this.suscription.push(
      this.activatedRoute.params.subscribe( params => {
        this.idPersonal = params.id;
        this.cargarEmpleado(this.idPersonal)
          .subscribe( async (t: any) => {
            this.turnosProfesional = t;
            this.turnosProfesional.sort((a, b) => {
              var x = a.fechaInicio.toLowerCase();
              var y = b.fechaInicio.toLowerCase();
              if (x > y) {return -1;}
              if (x < y) {return 1;}
              return 0;
            });
            await this.turnosProfesional.forEach(this.paraMostrar.bind(this));
            this.cargando = false;
            this.dataSource = new MatTableDataSource(this.turnosProfesional);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          })
        })
      );
  }

  cargarEmpleado(id: string) {
    return this.personalService.getPersonalId(id).pipe(
      mergeMap( (emp: any) => {
        if (emp === undefined) {
          sweetAlert('Error', 'No se encuentra personal con esa identificación', 'warning');
          this.route.navigate(['personal']);
        } else {
          this.personal = new EmpleadoProfile(
            emp.apellido,
            emp.nombre,
            emp.tipo_doc,
            emp.nro_doc,
            emp.nacionalidad,
            emp.sexo,
            emp.fecha_nac,
            emp.fecha_alta,
            emp.fecha_baja,
            emp.borrado,
            emp.domicilio,
            emp.contactos,
            emp.profesion,
            emp.ssocial,
            emp.familiares,
            emp.img,
            emp.observaciones,
            emp.actualizadoEl,
            emp.actualizadoPor,
            emp._id
            );
          // await this.getCreador(emp.actualizadoPor);
        }
        return this.turnosService.searchTurnos('idProfesional', id);
      })
    );
  }

  paraMostrar(turno, index, array) {
    this.getDuracion(turno, array, index);
    this.getPaciente(turno.idPaciente, array, index);
    // this.getEstilo(turno.estado, array, index);
  }

  public getPaciente(idPaciente: string, array, index) {
    this.pacienteService.getPacienteId(idPaciente)
      .subscribe( (resp: PacienteProfile) => {
        array[index].paciente = resp;
      });
  }

  private getDuracion(turno, array, index) {
    let inicio = moment(turno.horaInicio,'HH:mm');
    let fin = moment(turno.horaFin,'HH:mm');
    array[index].duracion = moment.duration(inicio.diff(fin)).humanize();
  }

  imprimir() {
    this.printService.titulo = 'Turnos del Profesional';
    this.printService.listaTurnosPersonal( this.personal, this.turnosProfesional);
    this.printService.imprimir();
  }

  exportarPdf() {
    this.exportPdfService.setEncabezado();
    this.exportPdfService.setTitle('Lista de turnos asignados');
    this.exportPdfService.crearListaTurnosProfesional(this.turnosProfesional);
    this.exportPdfService.guardar('Turnos_de_' + this.personal.apellido + '.pdf');
    return;
  }

  csvLista() {
    this.csvService.title = 'Turnos de ' + this.personal.getNombreCompleto();
    this.csvService.encabezado = ['Fecha', 'Paciente', 'Duración', 'Estado']
    this.csvService.data = this.turnosProfesional.map(this.turnoCsv);
    this.csvService.exportarDatos();
    this.csvService.exportar();
  }

  turnoCsv (turno, index, array) {
    return [
      turno.fechaInicio,
      turno.paciente.apellido + ' ' + turno.paciente.nombre,
      turno.duracion,
      turno.estado
    ];  
  }

}
