import { Component, OnInit, OnDestroy } from '@angular/core';
import { AreasService } from 'src/app/services/service.index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Area } from 'src/app/models/area.model';
import { ERRORES } from 'src/app/config/config';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  cargando: boolean;
  modo: string;
  ver: boolean;
  paramId: string;
  area: Area;
  error = ERRORES;
  suscriptor: Subscription[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public areaService: AreasService,
    public route: Router,
    public location: Location
  ) { }

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
          this.cargarArea(this.paramId);
        } else {
          this.area = new Area(
            '',
            ''
            );
            this.crearFormulario()
        }
    });
  }
    
  crearFormulario() {
    this.forma = new FormGroup({
      area: new FormControl(
        { value: this.area.area,
          disabled: this.ver
        }, Validators.required
        ),
        observaciones: new FormControl({
          value: this.area.observaciones,
          disabled: this.ver
        })
      });
  }
      
  cargarArea(id: string) {
    this.suscriptor.push(this.areaService.getAreaId(id)
      .subscribe( (resp: any) => {
        this.cargando = true;
        this.area = new Area(
          resp.area, resp.observaciones, resp._id
          );
          this.cargando = false;
          this.crearFormulario();
        })
    );
  }
        
  guardar() {
    if (this.forma.valid) {
      const area = this.forma.value;
      console.log(this.area)
      if (this.area._id === undefined || this.area._id === '') {
        console.log(area);
        this.areaService.createArea(area);
      } else {
        area._id = this.area._id;
        this.areaService.updateArea(area);
      }
    }
  }

  editarArea() {
    this.route.navigate(['/area/editar/' + this.area._id]);
  }

  imprimirArea() {

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
      