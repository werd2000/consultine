import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { ERRORES, MY_FORMATS } from 'src/app/config/config';
import { MatDialogRef, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from '@angular/material';
import {
  ModalTurnoService,
  PacienteService,
  AreasService,
  TurnosService,
  UsuarioService,
  PersonalService
} from 'src/app/services/service.index';
import { Turno } from 'src/app/models/turno.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { PacienteProfile } from 'src/app/models/paciente.model';
import { isString } from 'util';
import { EmpleadoProfile } from 'src/app/models/empleado.model';
import { Area } from 'src/app/models/area.model';
import { TurnoInterface } from 'src/app/interfaces/turno.interface';

@Component({
  selector: 'app-add-turno-quick',
  templateUrl: './add-turno-quick.component.html',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  styleUrls: ['./add-turno-quick.component.css']
})
export class AddTurnoQuickComponent implements OnInit {

  @Output() guardado;
  error = ERRORES;
  estados =
    ['PROGRAMADO', 'RE PROGRAMADO', 'PACIENTE ESPERANDO', 'DEMORADO', 'CANCELADO POR PACIENTE', 'CANCELADO POR PROFESIONAL', 'REALIZADO'];
  horario = { inicio: '08:00', fin: '20:00', paso: 300 };
  turno: Turno;
  forma: FormGroup;
  pacientes: PacienteProfile[];
  pacientesConFiltro: Observable<any[]>;
  profesionales: EmpleadoProfile[];
  areas: Area[];
  mostrarRepetirTurno = false;
  diaSemana: any;

  constructor(
    public dialogRef: MatDialogRef<AddTurnoQuickComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalTurnoService: ModalTurnoService,
    public pacienteService: PacienteService,
    public areasService: AreasService,
    public turnosService: TurnosService,
    public usuarioService: UsuarioService,
    public profesionalService: PersonalService,
  ) {
    this.guardado = new EventEmitter();
  }

  ngOnInit() {
    this.cargarPacientes();
    this.cargarAreas();
    this.cargarProfesionales();

    const fechaHoy = this.data;

    if (!this.data || typeof this.data === 'string') {
      this.turno = new Turno(
        '',
        '',
        fechaHoy,
        null,
        fechaHoy,
        null,
        '',
        '',
        fechaHoy,
        fechaHoy,
        '');
    } else {
      this.turno = this.data;
    }

    this.forma = new FormGroup({
      idPaciente: new FormControl(this.data.paciente, Validators.required),
      fechaInicio: new FormControl(this.turno.fechaInicio, Validators.required),
      horaInicio: new FormControl(this.turno.horaInicio, Validators.required),
      // fechaFin: new FormControl(this.turno.fechaFin, Validators.required),
      horaFin: new FormControl(this.turno.horaFin, Validators.required),
      // area: new FormControl(this.turno.area, Validators.required),
      idProfesional: new FormControl(this.turno.idProfesional, Validators.required),
      // estado:  new FormControl(this.turno.estado, Validators.required),
      observaciones: new FormControl(this.turno.observaciones),
      repetir: new FormControl(false)
    });

    this.pacientesConFiltro = this.forma.controls.idPaciente.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): PacienteProfile[] {
    if (isString(value)) {
      const filterValue = value.toUpperCase();
      if (this.pacientes) {
        return this.pacientes.filter(
          pacs => pacs.apellido.toUpperCase().includes(filterValue) || pacs.nombre.toUpperCase().includes(filterValue) );
      }
    }
  }

  mostrarNombrePaciente(paciente?: PacienteProfile): string | undefined {
    return paciente ? paciente.apellido + ' ' + paciente.nombre : undefined;
  }

  cargarPacientes() {
    this.pacienteService.getPacientes()
      .subscribe( (pacs: PacienteProfile[]) => {
        this.pacientes = pacs;
      });
  }

  cargarProfesionales() {
    this.profesionalService.getPersonal()
      .subscribe( (prof: EmpleadoProfile[]) => {
        this.profesionales = prof;
      });
  }

  cargarAreas() {
    this.areasService.getAreas()
      .subscribe( areas => {
        this.areas = areas;
      });
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  guardarTurno() {
    if (this.forma.invalid) {
      return;
    }
    const turno = this.forma.value;
    turno.fechaFin = turno.fechaInicio;
    turno.estado = 'PROGRAMADO';
    turno.area = 'NINGUNO';
    turno.creacion = moment().format('YYYY-MM-DD');
    turno.actualizado = moment().format('YYYY-MM-DD');
    turno.creadoPor = this.usuarioService.usuario._id;
    turno.idPaciente = this.forma.controls.idPaciente.value._id;
    console.log(turno);

    if (this.turno._id) {
      turno._id = this.turno._id;
      this.turnosService.updateTurno(turno);
    } else {
      // primero guardo el turno
      this.turnosService.createTurno(turno);
      this.repetirTurnos(turno);
    }
    this.guardado.emit(true);
    this.dialogRef.close();
  }

  repetirTurnos(turno: TurnoInterface) {
    // console.log (this.forma.controls.repetir.value);
    if (this.forma.controls.repetir.value) {
      // se repite
      for (let i = 0; i < 4; i++) {
        turno.fechaInicio = moment(turno.fechaInicio).add(7, 'days').format('YYYY-MM-DD');
        turno.fechaFin = moment(turno.fechaFin).add(7, 'days').format('YYYY-MM-DD');
        this.turnosService.createTurno(turno);
      }
    }
  }

  actualizarHoraFin() {
    const arrayHora = this.forma.controls.horaInicio.value.split(':');
    const hora = parseInt(arrayHora[0], 10);
    const min = parseInt(arrayHora[1], 10);
    let nuevoMin = min + 40;
    let nuevaHora = hora;
    if (nuevoMin >= 60) {
      nuevoMin = nuevoMin - 60;
      nuevaHora += 1;
    }
    if (nuevaHora >= 24) {
      nuevaHora = 0;
    }
    let strNuevoMin = nuevoMin + '';
    if (nuevoMin < 10) {
      strNuevoMin = '0' + nuevoMin;
    }
    let strNuevaHora = nuevaHora + '';
    if (nuevaHora <= 9 ) {
      strNuevaHora = '0' + nuevaHora;
    }
    const strHoraFin = strNuevaHora + ':' + strNuevoMin;

    this.forma.controls.horaFin.setValue(strHoraFin);

    this.mostrarRepetirTurno = true;
    this.diaSemana = moment(this.forma.controls.fechaInicio.value).format('dddd') +
      ' a las ' + this.forma.controls.horaInicio.value + 'hs';
  }

}
