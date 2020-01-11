import { Component, OnInit, OnDestroy } from '@angular/core';
// import { EmpleadoProfile } from 'src/app/models/empleado.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonalService } from '../../services/personal/personal.service';
import { UsuarioService, PrintService } from 'src/app/services/service.index';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Usuario } from 'src/app/models/usuario.model';
import { EmpleadoInterface } from 'src/app/interfaces/empleado.interface';
import { Countries } from 'src/app/globals/countries.enum';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
})
export class EmpleadoComponent implements OnInit, OnDestroy {

  public cargando: boolean;
  public empleado: EmpleadoInterface;
  public tabActual: number;
  public modo: string;
  public paramId: any;
  suscription: Subscription[] = [];
  public actualizadoPor: Usuario;

  constructor(
    public activatedRoute: ActivatedRoute,
    public route: Router,
    public empleadoService: PersonalService,
    public usuarioService: UsuarioService,
    public printService: PrintService,
  ) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe( p => {
      this.modo = p[1].path;
    });
    this.activatedRoute.params.subscribe( params => {
      this.cargando = true;
      this.paramId = params.id;
      this.tabActual = params.tab;
      if (this.paramId !== 'nuevo') {
        this.cargarEmpleado(this.paramId);
      } else {
        this.empleado = {
          apellido: '',
          nombre: '',
          tipoDoc: '',
          nroDoc: '',
          sexo: '',
          fechaNac: '',
          nacionalidad: Countries.Argentina,
          borrado: false,
          fechaAlta: moment().format('YYYY-MM-DD'),
          actualizadoEl: moment().format('YYYY-MM-DD'),
          actualizadoPor: '',
          observaciones: '',
          img: '',
          _id: '',
        };
        this.cargando = false;
      }
    });
  }

  ngOnDestroy() {
    this.suscription.forEach( elem => {
      elem.unsubscribe();
    })
  }

  cargarEmpleado( id: string ) {
    this.suscription.push(
      this.empleadoService.getPersonalId(id)
      .subscribe( (resp: any) => {
        this.cargando = true;
        if (resp === undefined) {
            sweetAlert('Error', 'No se encuentra un empleado con esa identificación', 'warning');
            this.route.navigate(['personal']);
          } else {
            this.empleado = {
              apellido: resp.apellido,
              nombre: resp.nombre,
              tipoDoc: resp.tipo_doc,
              nroDoc: resp.nro_doc,
              nacionalidad: resp.nacionalidad,
              sexo: resp.sexo,
              fechaNac: resp.fecha_nac,
              fechaAlta: resp.fecha_alta,
              fechaBaja: resp.fecha_baja,
              borrado: resp.borrado,
              domicilio: resp.domicilio,
              contactos: resp.contactos,
              profesion: resp.profesion,
              ssocial: resp.ssocial,
              familiares: resp.familiares,
              img: resp.img,
              observaciones: resp.observaciones,
              actualizadoEl: resp.actualizadoEl,
              actualizadoPor: resp.actualizadoPor,
              _id: resp._id
            };
          }
        if (this.empleado.actualizadoPor) {
              this.suscription.push(
              this.usuarioService.getUsuarioId(this.empleado.actualizadoPor)
                .subscribe( (usuario: Usuario) => {
                  this.cargando = true;
                  this.actualizadoPor = usuario;
                  this.cargando = false;
                }));
          }
        }
        )
      );
  }

  cambioTab(evento: any) {
    this.tabActual = evento.index;
  }

  imprimirEmpleado() {
    this.printService.titulo = 'Datos del Personal';
    this.printService.crearFichaPersonal(this.empleado);
    this.printService.imprimir();
  }

  editarEmpleado() {
    this.route.navigate(['/empleado/editar/' + this.empleado._id]);
  }

  verEmpleado() {
    this.route.navigate(['/empleado/ver/' + this.empleado._id]);
  }

  verTurnos() {
    this.route.navigate(['/turnos/personal/' + this.empleado._id]);
  }

}
