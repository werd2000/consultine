import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS, ERRORES } from 'src/app/config/config';
import { EmpleadoProfile } from 'src/app/models/empleado.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  TipoDocService,
  SexoService,
  FechaEdadService,
  PersonalService,
  PrintService,
  UsuarioService,
  SubirArchivoService
} from 'src/app/services/service.index';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-empleado-principal',
  templateUrl: './empleadoPrincipal.component.html',
  styleUrls: ['./empleadoPrincipal.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class EmpleadoPrincipalComponent implements OnInit {

  @Input() empleado: EmpleadoProfile;
  @Input() modo: string;
  ver: boolean;
  forma: FormGroup;
  listaSexos: string[];
  listaTipoDoc: string[];
  edad: string;
  imagenSubir: File;
  imagenTemp;
  error = ERRORES;

  constructor(
    public tipoDocService: TipoDocService,
    public sexoService: SexoService,
    public fechaEdadService: FechaEdadService,
    public router: Router,
    private location: Location,
    public empleadoService: PersonalService,
    public printService: PrintService,
    public usuarioService: UsuarioService,
    public subirArchivoService: SubirArchivoService
  ) { }

  ngOnInit() {
    if (this.modo === 'ver') {
      this.ver = true;
    }
    this.crearFormulario();
    this.listaTipoDoc = this.tipoDocService.tipo_doc;
    this.listaSexos = this.sexoService.sexo;
    this.edad = this.fechaEdadService.calcularEdad(this.empleado.fecha_nac);
  }

  crearFormulario() {
    this.forma = new FormGroup({
      nombre: new FormControl(
        { value: this.empleado.nombre,
          disabled: this.ver
        },
        Validators.required
        ),
      apellido: new FormControl({
        value: this.empleado.apellido,
        disabled: this.ver
      }, Validators.required),
      tipo_doc: new FormControl({
        value: this.empleado.tipo_doc,
        disabled: this.ver
      }),
      nro_doc: new FormControl({
        value: this.empleado.nro_doc,
        disabled: this.ver
       }, Validators.required),
      sexo: new FormControl({
        value: this.empleado.sexo,
        disabled: this.ver}),
      nacionalidad: new FormControl({
        value: this.empleado.nacionalidad,
        disabled: this.ver}),
      fecha_nac: new FormControl({
        value: this.empleado.fecha_nac,
        disabled: this.ver}),
      fecha_alta: new FormControl({
        value: this.empleado.fechaAlta,
        disabled: this.ver}),
      fecha_baja: new FormControl({
        value: this.empleado.fechaBaja,
        disabled: this.ver}),
      observaciones: new FormControl({
        value: this.empleado.observaciones,
        disabled: this.ver})
    });
  }

  guardar() {
    if (this.forma.valid) {
      const empleado = this.forma.value;
      this.controlFechaNac(empleado);
      this.controlFechaAlta(empleado);
      this.controlFechaBaja(empleado);
      empleado.img = this.empleado.img || '';
      empleado.actualizadoPor = this.usuarioService.usuario._id;
      empleado.actualizadoEl = moment().format('YYYY-MM-DD');
      empleado.domicilio = this.empleado.domicilio || null;
      empleado.contactos = this.empleado.contactos || null;
      empleado.familiares = this.empleado.familiares || null;
      empleado.ssocial = this.empleado.ssocial || 'null';
      empleado.profesion = this.empleado.profesion || '';
      empleado.observaciones = this.forma.value.observaciones || '';

      if (this.empleado._id === undefined) {
        this.empleadoService.createPersonal(empleado);
      } else {
        empleado._id = this.empleado._id;
        this.empleadoService.updatePersonal(empleado);
      }
    }

  }

  editarEmpleado() {
    this.router.navigate(['/empleado/editar/' + this.empleado._id]);
  }

  cancelar() {
    this.location.back();
  }

  controlFechaNac(empleado) {
    if (this.forma.value.fecha_nac) {
      if ( moment.isMoment(this.forma.value.fecha_nac)) {
        empleado.fecha_nac = this.forma.value.fecha_nac.format('YYYY-MM-DD');
      } else {
        empleado.fecha_nac = this.forma.value.fecha_nac;
      }
    } else {
      empleado.fecha_nac = '';
    }
  }

  controlFechaAlta(empleado) {
    if (this.forma.value.fecha_alta) {
      if ( moment.isMoment(this.forma.value.fecha_alta)) {
        empleado.fecha_alta = this.forma.value.fecha_alta.format('YYYY-MM-DD');
      } else {
        empleado.fecha_alta = this.forma.value.fecha_alta;
      }
    } else {
      empleado.fecha_alta = '';
    }
  }

  controlFechaBaja(empleado) {
    if (this.forma.value.fecha_baja) {
      if ( moment.isMoment(this.forma.value.fecha_baja)) {
        empleado.fecha_baja = this.forma.value.fecha_baja.format('YYYY-MM-DD');
      } else {
        empleado.fecha_baja = this.forma.value.fecha_baja;
      }
    } else {
      empleado.fecha_baja = '';
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
    this.subirArchivoService.subirArchivo( this.imagenSubir, 'profesional', this.empleado )
      .then( resp => sweetAlert('Imagen subida', 'La imagen se subió con exito', 'success'))
      .catch( error => console.error(error));
  }

}
