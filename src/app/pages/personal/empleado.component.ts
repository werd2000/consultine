import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmpleadoProfile } from 'src/app/models/empleado.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonalService } from '../../services/personal/personal.service';
import { UsuarioService, PrintService } from 'src/app/services/service.index';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
})
export class EmpleadoComponent implements OnInit, OnDestroy {

  public cargando: boolean;
  public empleado: EmpleadoProfile;
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
        this.empleado = new EmpleadoProfile(
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          moment().format('YYYY-MM-DD'),
          '',
          false,
          // new Domicilio('', '', '', '', '', '', '', 0, 0),
          null,
          null,
          null,
          null,
          null,
          '',
          '',
          moment().format('YYYY-MM-DD'),
          '');
        this.actualizadoPor = this.usuarioService.usuario;
        }
      this.cargando = false;
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
            this.empleado = new EmpleadoProfile(
              resp.apellido,
              resp.nombre,
              resp.tipo_doc,
              resp.nro_doc,
              resp.nacionalidad,
              resp.sexo,
              resp.fecha_nac,
              resp.fecha_alta,
              resp.fecha_baja,
              resp.borrado,
              resp.domicilio,
              resp.contactos,
              resp.profesion,
              resp.ssocial,
              resp.familiares,
              resp.img,
              resp.observaciones,
              resp.actualizadoEl,
              resp.actualizadoPor,
              resp._id
              );
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
    this.route.navigate(['/turnos/personal/' + this.empleado._id])    
  }

}
