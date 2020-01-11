import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { PacienteProfile } from 'src/app/models/paciente.model';
import { Subscription } from 'rxjs';
import { PacienteService, PrintService } from 'src/app/services/service.index';
import sweetAlert from 'sweetalert';
import * as moment from 'moment';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Domicilio } from 'src/app/models/domicilio.model';
import { MatDialog } from '@angular/material/dialog';
import { ConstanciaTratamientoComponent } from './constancia-tratamiento.component';
import { PacienteInterface } from 'src/app/interfaces/paciente.interface';
import { Countries } from 'src/app/globals/countries.enum';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  // styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  paramId: any;
  paciente: PacienteInterface;
  cargando: boolean;
  suscription: Subscription[] = [];
  modo: string;
  actualizadoPor: Usuario;
  tabActual: number;
  nombrePaciente: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public route: Router,
    public pacientesService: PacienteService,
    public usuarioService: UsuarioService,
    public printService: PrintService,
    public dialog: MatDialog
  ) {
    this.cargando = false;
  }

  ngOnInit() {
    this.suscription.push(
      this.activatedRoute.queryParams.subscribe( query => {
        this.modo = query.action;
      })
    );

    this.activatedRoute.params.subscribe( params => {
      this.paramId = params.id;
      this.tabActual = params.tab;
      if (this.paramId !== 'nuevo') {
        this.cargarPaciente(this.paramId);
      } else {
        this.nombrePaciente = 'Paciente nuevo';
        this.paciente = {
          apellido: '',
          nombre: '',
          tipoDoc: 'DNI',
          nroDoc: '',
          nacionalidad: Countries.Argentina,
          sexo: '',
          fechaNac: '',
          estado: null,
          fechaAlta: moment().format('YYYY-MM-DD'),
          fechaBaja: '',
          borrado: false,
          domicilio: {},
          contactos: null,
          ssocial: null,
          familiares: null,
          img: '',
          observaciones: '',
          actualizadoEl: moment().format('YYYY-MM-DD'),
          actualizadoPor: ''
        };
        this.actualizadoPor = this.usuarioService.usuario;
      }
    });
  }

  cargarPaciente( id: string ) {
    this.cargando = true;
    this.suscription.push(
      this.pacientesService.getPacienteId(id)
        .subscribe( (resp: any) => {
          if (resp === undefined) {
            sweetAlert('Error', 'No se encuentra un paciente con esa identificación', 'warning');
            this.route.navigate(['pacientes']);
          } else {
            this.nombrePaciente = resp.apellido + ', ' + resp.nombre;
            this.paciente = {
              apellido: resp.apellido,
              nombre: resp.nombre,
              tipoDoc: resp.tipo_doc,
              nroDoc: resp.nro_doc,
              nacionalidad: resp.nacionalidad,
              sexo: resp.sexo,
              fechaNac: resp.fecha_nac,
              estado: resp.estado,
              fechaAlta: resp.fecha_alta,
              fechaBaja: resp.fecha_baja,
              borrado: resp.borrado,
              domicilio: resp.domicilio,
              contactos: resp.contactos,
              ssocial: resp.ssocial,
              familiares: resp.familiares,
              img: resp.img,
              observaciones: resp.observaciones,
              actualizadoEl: resp.actualizadoEl,
              actualizadoPor: resp.actualizadoPor,
              _id: resp._id
            };
          }
          if (this.paciente.actualizadoPor) {
              this.suscription.push(
                this.usuarioService.getUsuarioId(this.paciente.actualizadoPor)
                  .subscribe( (usuario: Usuario) => {
                    console.log('actualizado por', this.paciente.actualizadoPor);
                    this.cargando = true;
                    this.actualizadoPor = usuario;
                    this.cargando = false;
                    console.log('usuario', this.actualizadoPor);
                  }));
          }
        }
        )
      );
  }

  cambioTab(evento: any) {
    this.tabActual = evento.index;
  }

  imprimirPaciente() {
    this.printService.titulo = 'Datos del Paciente';
    this.printService.crearFichaPaciente(this.paciente);
    this.printService.imprimir();
  }

  verTurnos() {
    this.route.navigate(['/turnos/paciente/' + this.paciente._id]);
  }

  editarPaciente() {
    this.route.navigate(['/paciente/editar/' + this.paciente._id]);
  }

  verPaciente() {
    this.route.navigate(['/paciente/ver/' + this.paciente._id]);
  }

  constanciaTratamiento(): void {
    // console.log('constancia de tratamiento');
    const dialogRef = this.dialog.open(ConstanciaTratamientoComponent, {
      width: '500px',
      data: {
        // tslint:disable-next-line: max-line-length
        texto: `Se hace constar que ${this.paciente.apellido}, ${this.paciente.nombre} se encuentra en tratamiento FONOAUDIOLÓGICO en este instituto asistiendo los días __________ a las ______hs.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log(result);
        this.printService.crearConstanciaTratamiento(result);
        this.printService.imprimir();
      }
      // console.log('The dialog was closed');
    });
  }

}
