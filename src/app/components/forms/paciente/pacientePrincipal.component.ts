import { Component, OnInit, Input, Output } from '@angular/core';
// import { PacienteProfile } from 'src/app/models/paciente.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  TipoDocService,
  SexoService,
  FechaEdadService,
  PacienteService,
  UsuarioService,
} from 'src/app/services/service.index';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS, ERRORES } from 'src/app/config/config';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SubirArchivoService } from 'src/app/services/service.index';
import sweetAlert from 'sweetalert';
import { Subscription } from 'rxjs';
import { PacienteInterface } from 'src/app/interfaces/paciente.interface';
import { EstadosPaciente } from 'src/app/globals/estadosPaciente.enum';

@Component({
  selector: 'app-paciente-principal',
  templateUrl: './pacientePrincipal.component.html',
  styleUrls: ['./pacientePrincipal.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class PacientePrincipalComponent implements OnInit {

  // @Input() paciente: PacienteProfile;
  @Input() paciente: PacienteInterface;
  // @Input() modo: string;
  // @Output() imprimir: EventEmitter<PacienteProfile>;
  ver: boolean = false;
  forma: FormGroup;
  listaEstadosPacientes = Object.keys(EstadosPaciente).map(
    key => (EstadosPaciente[key]));
  listaSexos: string[];
  listaTipoDoc: string[];
  edad: string;
  imagenSubir: File;
  imagenTemp: any;
  error = ERRORES;
  suscription: Subscription[] = [];
  // modo: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public tipoDocService: TipoDocService,
    public sexoService: SexoService,
    public fechaEdadService: FechaEdadService,
    public router: Router,
    private location: Location,
    public pacienteService: PacienteService,
    public usuarioService: UsuarioService,
    public subirArchivoService: SubirArchivoService
  ) {
    // this.imprimir = new EventEmitter();
  }

  ngOnInit() {
    console.log(this.listaEstadosPacientes);
    this.crearFormulario();
    this.listaTipoDoc = this.tipoDocService.tipo_doc;
    this.listaSexos = this.sexoService.sexo;
    this.edad = this.fechaEdadService.calcularEdad(this.paciente.fechaNac);
    this.suscription.push(
      this.activatedRoute.queryParams.subscribe( query => {
        if (query.action === 'view') {
          this.ver = true;
          this.forma.disable();
        } else {
          this.ver = false;
          this.forma.enable();
        }
      })
    );

  }

  crearFormulario() {
    this.forma = new FormGroup({
      nombre: new FormControl( this.paciente.nombre, Validators.required),
      apellido: new FormControl( this.paciente.apellido, Validators.required),
      tipo_doc: new FormControl( this.paciente.tipoDoc ),
      nro_doc: new FormControl( this.paciente.nroDoc, Validators.required),
      sexo: new FormControl( this.paciente.sexo),
      nacionalidad: new FormControl( this.paciente.nacionalidad ),
      fecha_nac: new FormControl( this.paciente.fechaNac ),
      fecha_alta: new FormControl( this.paciente.fechaAlta ),
      fecha_baja: new FormControl( this.paciente.fechaBaja ),
      estado: new FormControl( this.paciente.estado ),
      observaciones: new FormControl( this.paciente.observaciones || null )
    });
  }

  guardar() {
    if (this.forma.valid) {
      const paciente = this.forma.value;
      console.log(paciente);
      this.controlFechaNac(paciente);
      this.controlFechaAlta(paciente);
      this.controlFechaBaja(paciente);
      paciente.img = this.paciente.img;
      paciente.actualizadoPor = this.usuarioService.usuario._id;
      paciente.actualizadoEl = moment().format('YYYY-MM-DD');
      paciente.contactos = this.paciente.contactos || null;
      paciente.familiares = this.paciente.familiares || null;
      paciente.ssocial = this.paciente.ssocial || null;

      if (this.paciente._id === undefined) {
        this.pacienteService.createPaciente(paciente);
      } else {
        paciente.domicilio = this.paciente.domicilio;
        paciente._id = this.paciente._id;
        this.pacienteService.updatePaciente(paciente);
      }
    }
  }

  editarPaciente() {
    this.router.navigate(['/paciente/editar/' + this.paciente._id]);
  }

  cancelar() {
    this.location.back();
  }

  // imprimirPaciente() {
    // this.imprimir.emit(this.paciente);
  // }

  controlFechaNac(paciente) {
    if (this.forma.value.fecha_nac) {
      if ( moment.isMoment(this.forma.value.fecha_nac)) {
        paciente.fecha_nac = this.forma.value.fecha_nac.format('YYYY-MM-DD');
      } else {
        paciente.fecha_nac = this.forma.value.fecha_nac;
      }
    } else {
      paciente.fecha_nac = '';
    }
  }

  controlFechaAlta(paciente) {
    if (this.forma.value.fecha_alta) {
      if ( moment.isMoment(this.forma.value.fecha_alta)) {
        paciente.fecha_alta = this.forma.value.fecha_alta.format('YYYY-MM-DD');
      } else {
        paciente.fecha_alta = this.forma.value.fecha_alta;
      }
    } else {
      paciente.fecha_alta = '';
    }
  }

  controlFechaBaja(paciente) {
    if (this.forma.value.fecha_baja) {
      if ( moment.isMoment(this.forma.value.fecha_baja)) {
        paciente.fecha_baja = this.forma.value.fecha_baja.format('YYYY-MM-DD');
      } else {
        paciente.fecha_baja = this.forma.value.fecha_baja;
      }
    } else {
      paciente.fecha_baja = '';
    }
  }

  calcularEdad(event) {
    this.edad = this.fechaEdadService.calcularEdad(this.forma.value.fecha_nac.format('YYYY-MM-DD'));
  }

  seleccionImagen( archivo: File ) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    if ( archivo.type.indexOf('image')) {
      sweetAlert('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );
    reader.onloadend = () => this.imagenTemp = reader.result;

  }

  // Toma el archivo y lo lleva al servicio
  cambiarImagen() {
    this.subirArchivoService.subirArchivo( this.imagenSubir, 'paciente', this.paciente )
      .then( resp => sweetAlert('Imagen subida', 'La imagen se subió con exito', 'success'))
      .catch( error => console.error(error));
  }

}
