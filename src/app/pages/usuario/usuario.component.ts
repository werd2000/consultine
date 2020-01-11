import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, PrintService, SubirArchivoService } from 'src/app/services/service.index';
import { Subscription } from 'rxjs';
import sweetAlert from 'sweetalert';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ERRORES } from 'src/app/config/config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuario: Usuario;
  modo: string;
  paramId: any;
  cargando: boolean;
  suscription: Subscription[] = [];
  forma: FormGroup;
  ver: boolean;
  error = ERRORES;
  listaRoles: string[] = ['ROLE_ADMIN', 'ROLE_PROF', 'ROLE_USER'];
  imagenTemp: any;
  imagenSubir: File;

  constructor(
    public activatedRoute: ActivatedRoute,
    public route: Router,
    public usuarioService: UsuarioService,
    private location: Location,
    public printService: PrintService,
    public subirArchivoService: SubirArchivoService,
  ) {
    this.ver = false;
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe( p => {
      this.modo = p[1].path;
      if (this.modo === 'ver') {
        this.ver = true;
      }
    });
    this.activatedRoute.params.subscribe( params => {
      this.paramId = params.id;
      if (this.paramId !== 'nuevo') {
        this.cargarUsuario(this.paramId);
      } else {
        this.usuario = new Usuario(
          '',
          '',
          '',
          '',
          '',
        );
      }
    });
  }

  cargarUsuario( id: string ) {
    this.cargando = true;
    this.suscription.push(
      this.usuarioService.getUsuarioId(id)
        .subscribe( (resp: any) => {
          if (resp === undefined) {
            sweetAlert('Error', 'No se encuentra un usuario con esa identificación', 'warning');
            this.route.navigate(['usuarios']);
          } else {
            this.usuario = new Usuario(
              resp.nombre,
              resp.email,
              ':)',
              resp.img,
              resp.role,
              resp.google,
              resp._id,
            );
          }
          this.crearFormulario();
          this.cargando = false;
        }
        )
      );
  }

  crearFormulario() {
    this.forma = new FormGroup({
      nombre: new FormControl(
        { value: this.usuario.nombre,
          disabled: this.ver
        },
        Validators.required
        ),
      email: new FormControl({
        value: this.usuario.email,
        disabled: true
      }, Validators.required),
      role: new FormControl({
        value: this.usuario.role,
        disabled: this.ver
      }),
      google: new FormControl({
        value: this.usuario.google,
        disabled: true
       }, Validators.required),
    });
    // this.forma.setValue(this.paciente);
  }

  guardar() {
    if (this.forma.valid) {
      const usuario = this.forma.value;
      usuario.img = this.usuario.img;
      if (this.usuario._id === undefined) {
        console.log(usuario);
        this.usuarioService.createUsuario(usuario);
      } else {
        if (this.usuario.google) {
          usuario.email = this.usuario.email;
          usuario.google = this.usuario.google;
          usuario.password = ':)';
        }
        usuario._id = this.usuario._id;
        console.log(usuario);
        this.usuarioService.updateUsuario(usuario);
      }
    }
  }

  editarUsuario() {
    this.route.navigate(['/usuario/editar/' + this.usuario._id]);
  }

  imprimirUsuario() {
    this.printService.titulo = 'Datos del Usuario';
    const encabezado = ['Imagen', 'Nombre', 'Email', 'Google'];
    this.printService.imprimirFichaUsuario(this.usuario);
    this.printService.imprimir();
  }

  cancelar() {
    this.location.back();
  }

  // Toma el archivo y lo lleva al servicio
  cambiarImagen() {
    this.subirArchivoService.subirArchivo( this.imagenSubir, 'profesional', this.usuario )
      .then( resp => sweetAlert('Imagen subida', 'La imagen se subió con exito', 'success'))
      .catch( error => console.error(error));
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

}
