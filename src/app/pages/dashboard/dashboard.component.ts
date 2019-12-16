import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService, PersonalService, TurnosService, AreasService } from 'src/app/services/service.index';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { AddTurnoComponent } from '../turnos/add-turno.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public cargando: boolean;
  public cantPacientes: number;
  public cantPersonal: number;
  public cantTurnos: number;
  public cantAreas: number;
  fecha: moment.Moment;

  constructor(
    private pacientesService: PacienteService,
    private personalService: PersonalService,
    private turnosService: TurnosService,
    private areasService: AreasService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.fecha = moment();
    this.pacientesService.getPacientes()
      .subscribe( (pac) => {
        this.cantPacientes = pac.length;
      });

    this.personalService.getPersonal()
      .subscribe( (pers) => {
        this.cantPersonal = pers.length;
      });

    this.turnosService.searchTurnos('fechaInicio', this.fecha.format('YYYY-MM-DD'))
      .subscribe( (turnos) => {
        this.cantTurnos = turnos.length;
      });

    this.areasService.getAreas()
      .subscribe( (areas) => {
        this.cantAreas = areas.length;
      });
  }

  crearNuevoPaciente() {
    this.router.navigate(['/paciente/nuevo']);
  }

  crearNuevoProfesional() {
    this.router.navigate(['/empleado/nuevo']);
  }

  crearNuevoTurno() {
      const dialogRef = this.dialog.open(AddTurnoComponent, {
        width: '50%',
        data: this.fecha.format('YYYY-MM-DD')
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
        }
        // this.cargarTurnos();
      });
  }

  crearNuevaArea() {
    this.router.navigate(['/area/nuevo']);
  }
}
