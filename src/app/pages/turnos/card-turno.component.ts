import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Turno } from 'src/app/models/turno.model';
import { UsuarioService, PacienteService, PersonalService, TurnosService } from 'src/app/services/service.index';
import { MatDialog } from '@angular/material/dialog';
import { AddTurnoComponent } from 'src/app/pages/turnos/add-turno.component';
import { TurnosFunctions } from './turnos.functions';

@Component({
  selector: 'app-card-turno',
  templateUrl: './card-turno.component.html',
})
export class CardTurnoComponent implements OnInit {

  @Input() turno: any;
  @Output() actualizar = new EventEmitter();

  turnosFunction: any;
  menuTurnoWidth: string;

  constructor(
    public usuarioService: UsuarioService,
    public pacienteService: PacienteService,
    public personalService: PersonalService,
    public dialog: MatDialog,
    public turnosService: TurnosService
  ) {
      this.turnosFunction = new TurnosFunctions(
      this.usuarioService,
      this.pacienteService,
      this.personalService
    );
  }

  ngOnInit() {
  }

  editarTurno(t: Turno) {    
    const arrayT = [t];
    const dialogRef = this.dialog.open(AddTurnoComponent, {
      width: '50%',
      data: arrayT[0]
    });
    dialogRef.afterClosed().subscribe(result => {      
        this.actualizar.emit(true);
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
            this.actualizar.emit(true);
        })
      }
    });
  }

  
}
