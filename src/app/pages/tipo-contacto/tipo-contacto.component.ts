import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TipoContactoService } from 'src/app/services/service.index';
import { Subscription } from 'rxjs';
import { TipoContacto } from 'src/app/models/TipoContacto.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ERRORES } from 'src/app/config/config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tipo-contacto',
  templateUrl: './tipo-contacto.component.html',
  styleUrls: ['./tipo-contacto.component.css']
})
export class TipoContactoComponent implements OnInit, OnDestroy {

  private tipo: TipoContacto;
  forma: FormGroup;
  cargando: boolean;
  modo: string;
  ver: boolean;
  paramId: string;
  error = ERRORES;
  suscriptor: Subscription[] = [];
  
  
  constructor(
    public activatedRoute: ActivatedRoute,
    public tipoContactoService: TipoContactoService,
    public route: Router,
    public location: Location
    ) {}
    
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
          this.cargarTipo(this.paramId);
        } else {
          this.tipo = new TipoContacto(
            '',
            ''
            );
            this.crearFormulario()
        }
    });
  }

  crearFormulario() {
    this.forma = new FormGroup({
      tipo: new FormControl(
        { value: this.tipo.tipo,
          disabled: this.ver
        }, Validators.required
        ),
        observaciones: new FormControl({
          value: this.tipo.observaciones,
          disabled: this.ver
        })
      });
  }

  cargarTipo(id: string) {
    this.suscriptor.push(this.tipoContactoService.getTipoContactoId(id)
      .subscribe( (resp: any) => {
        this.cargando = true;
        this.tipo = new TipoContacto(
          resp.tipo, resp.observaciones, resp._id
          );
          this.cargando = false;
          this.crearFormulario();
        })
    );
  }

  guardar() {
    if (this.forma.valid) {
      const tipo = this.forma.value;
      console.log(this.tipo)
      if (this.tipo._id === undefined || this.tipo._id === '') {
        console.log(tipo);
        this.tipoContactoService.createTipo(tipo);
      } else {
        tipo._id = this.tipo._id;
        this.tipoContactoService.updateTipoContacto(tipo)
      }
    }
  }

  editarTipo() {
    this.route.navigate(['/tipo-contacto/editar/' + this.tipo._id]);
  }

  imprimirTipo() {

  }

  cancelar() {
    this.location.back();
  }

  ngOnDestroy() {
    this.suscriptor.forEach(element => {
      element.unsubscribe();
    });
  }

}
