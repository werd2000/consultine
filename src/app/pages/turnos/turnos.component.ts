import { LOCALE_ID, Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { PersonalService, TurnosService, UsuarioService, PacienteService, ModalTurnoService } from 'src/app/services/service.index';
import { EmpleadoProfile } from 'src/app/models/empleado.model';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AddTurnoComponent } from './add-turno.component';
import { TurnosFunctions } from './turnos.functions';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS } from 'src/app/config/config';
import { AddTurnoQuickComponent } from './add-turno-quick.component';
import { Turno } from 'src/app/models/turno.model';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    { provide: LOCALE_ID, useValue: 'es-AR'}
  ]
})
export class TurnosComponent implements OnInit, OnDestroy {

  @Output() actualizar = new EventEmitter();
  cargando: boolean;
  columns = [];
  widthColumnE: string;
  widthColumnD: string;
  turnos: any;
  suscriptor: Subscription[] = [];
  fecha: moment.Moment;
  turnosFunction: any;
  cantProfesionales: number;

  constructor(
    public personalService: PersonalService,
    public turnosService: TurnosService,
    public usuarioService: UsuarioService,
    public pacienteService: PacienteService,
    public modalTurnoService: ModalTurnoService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.fecha = moment();
    this.turnosFunction = new TurnosFunctions(
      this.usuarioService,
      this.pacienteService,
      this.personalService
    );
    this.cargarTurnos();
  }

  cargarTurnos() {
    this.cantProfesionales = 0;
    this.suscriptor.push(this.personalService.getPersonal()
      .subscribe( (personal: EmpleadoProfile[]) => {
        this.columns = [];
        this.cargando = true;
        personal.forEach(profesional => {
          // console.log(profesional);
          if (profesional.profesion[0].area !== 'ADMINISTRACION') {
            this.cantProfesionales++;
            this.suscriptor.push(
              this.turnosService.getTurnosFechaProfesional(this.fecha.format('YYYY-MM-DD'), profesional._id)
                .subscribe(async (t: any) => {
                  this.turnos = t;
                  this.turnos.sort((a, b) => {
                      const x = a.horaInicio.toLowerCase();
                      const y = b.horaInicio.toLowerCase();
                      if (x < y) {return -1; }
                      if (x > y) {return 1; }
                      return 0;
                  });

                  await this.turnos.forEach(
                    // this.turnosFunction.paraMostrar.bind(this)
                    this.turnosFunction.configuraPaciente.bind(this)
                  );
                  await this.turnos.forEach(
                    // this.turnosFunction.paraMostrar.bind(this)
                    this.turnosFunction.configuraProfesional.bind(this)
                  );
                  await this.turnos.forEach(
                    this.turnosFunction.configuraEstado.bind(this)
                  );
                  await this.turnos.forEach(
                    this.turnosFunction.configuraUsuario.bind(this)
                  );
                  await this.turnos.forEach(
                    this.turnosFunction.calcularDuracion.bind(this)
                  );
                  await this.turnos.forEach(
                    this.turnosFunction.configurarTop.bind(this)
                  );
                  console.log(this.turnos);

                  this.columns.push({
                      head: profesional,
                      campo: profesional.nombre,
                      id: profesional._id,
                      turnos: this.turnos
                    });
                })
              );
          }
        });

        const elem = document.getElementById('turnos');
        // this.widthColumnE = (elem.offsetWidth / this.cantProfesionales) + 'px';
        this.widthColumnE = (100 / this.cantProfesionales) + '%';
        const elemT = document.getElementById('turnos');
        this.widthColumnD = (elemT.offsetWidth / this.cantProfesionales) - 1 + 'px';
        // this.widthColumnD = elemT.offsetWidth + 'px';
        this.cargando = false;

      })
    );
  }

  editarTurno(t: Turno) {
    const arrayT = [t];
    const dialogRef = this.dialog.open(AddTurnoComponent, {
      width: '50%',
      data: arrayT[0]
    });
    dialogRef.afterClosed().subscribe(result => {
        this.actualizar.emit(true);
        console.log(result);
        this.cargarTurnos();
    });
  }

  eliminarTurno(t: any) {
    sweetAlert({
      title: 'Atención, está por borrar datos',
      text: 'Una vez borrados, no se podrán recuperar',
      icon: 'warning',
      buttons: ['Calcelar', 'Borrar'],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        this.turnosService.deleteTurno(t)
        .then(resp => {
            sweetAlert ('Datos borrados', `Los datos del turno ${ t.paciente.apellido } se borraron correctamente`, 'success');
            // this.actualizar.emit(true);
            this.cargarTurnos();
        });
      }
    });
  }

  marcarRealizado(t: any) {
    const turno = {
      _id : t._id,
      actualizado : t.actualizado,
      area : t.area,
      creacion : t.creacion,
      creadoPor : t.creadoPor,
      estado : 'REALIZADO',
      fechaFin : t.fechaFin,
      fechaInicio : t.fechaInicio,
      horaFin : t.horaFin,
      horaInicio : t.horaInicio,
      idPaciente : t.idPaciente,
      idProfesional : t.idProfesional,
      observaciones : t.observaciones,
      repetir : t.repetir,
    };
    // console.log(turno);
    this.turnosService.updateTurno(turno);
    this.cargarTurnos();
  }


  ngOnDestroy() {
    this.suscriptor.forEach(element => {
      element.unsubscribe();
    });
  }

  nuevo(): void {
    const dialogRef = this.dialog.open(AddTurnoQuickComponent, {
      width: '50%',
      data: this.fecha.format('YYYY-MM-DD')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
      this.cargarTurnos();
    });
  }

  hoy() {
    this.fecha = moment();
    this.cargarTurnos();
  }

  diaAnterior() {
    const diaAnterior = moment(this.fecha).subtract(1, 'days');
    this.fecha = diaAnterior;
    this.cargarTurnos();
  }

  diaSiguiente() {
    const diaSiguiente = moment(this.fecha).add(1, 'days');
    this.fecha = diaSiguiente;
    this.cargarTurnos();
  }

  cambiarFecha(event) {
    this.fecha = event.value;
    this.cargarTurnos();
  }

  imprimir() {
    const printContents = document.getElementsByClassName('turnos')[0].innerHTML;
    const w = window.open();
    w.document.write('<html><head>');
    w.document.write('<link href="../styles.css" rel="stylesheet">');
    w.document.write('<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">');
    w.document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">');
    w.document.write('<link rel="stylesheet" href="assets/css/styles.css">');
    w.document.write('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">');
    
    w.document.write('</head><body>');
    w.document.write('<mat-card>');
    w.document.write(printContents);
    w.document.write('</mat-card>');
    w.document.write('</body></html>');
    w.document.close(); // necessary for IE >= 10
    w.focus(); // necessary for IE >= 10
		//   w.print();
		//   w.close();
    // return true;
  }

}
