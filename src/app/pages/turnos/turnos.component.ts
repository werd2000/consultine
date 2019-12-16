import { LOCALE_ID, Component, OnInit, OnDestroy } from '@angular/core';
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

  cargando: boolean;
  columns = [];
  widthColumnE: string;
  widthColumnD: string;
  turnos: any;
  suscriptor: Subscription[] = [];
  fecha: moment.Moment;
  turnosFunction: any;

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
    this.suscriptor.push(this.personalService.getPersonal()
      .subscribe( (personal: EmpleadoProfile[]) => {
        this.columns = [];
        this.cargando = true;
        personal.forEach(profesional => {
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
                  this.turnosFunction.paraMostrar.bind(this)
                );

                this.columns.push({
                    head: profesional,
                    campo: profesional.nombre,
                    id: profesional._id,
                    turnos: this.turnos
                  });
              })
            );
        });

        let elem = document.getElementById('encabezado-turnos');
        this.widthColumnE = (elem.offsetWidth / personal.length) + 'px';
        elem = document.getElementById('detalle-turnos');
        this.widthColumnD = (elem.offsetWidth / personal.length) - 1 + 'px';
        this.cargando = false;
      })
    );
  }


  ngOnDestroy() {
    this.suscriptor.forEach(element => {
      element.unsubscribe();
    });
  }

  nuevo(): void {
    const dialogRef = this.dialog.open(AddTurnoComponent, {
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

}
