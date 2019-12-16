import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Profesion } from 'src/app/models/profesion.model';
import { ERRORES } from 'src/app/config/config';
import { Area } from 'src/app/models/area.model';
import { Router } from '@angular/router';
import { AreasService, ProfesionService } from 'src/app/services/service.index';
import { PersonaInterface } from 'src/app/interfaces/persona.interface';

@Component({
  selector: 'app-profesion',
  templateUrl: './profesion.component.html',
  styleUrls: ['./profesion.component.css']
})
export class ProfesionComponent implements OnInit {

  @Input() persona;
  @Input() tipo: string;
  @Input() modo: string;
  @Output() imprimir: EventEmitter<PersonaInterface>;
  formaProfesion: FormGroup;
  profesion: Profesion;
  listaProfesiones: Profesion[] = [];
  error = ERRORES;
  ver: boolean;
  listaAreas: Area[];
  cantProfesion: number;
  cargando: boolean;

  constructor(
    public router: Router,
    public areaService: AreasService,
    public profesionService: ProfesionService
  ) {
    this.imprimir = new EventEmitter();
  }

  ngOnInit() {
    this.cargando = true;
    this.areaService.getAreas()
        .subscribe( resp => {
          this.listaAreas = resp;
        });
    if (this.modo === 'ver') {
      this.ver = true;
    }
    if (this.persona.profesion === undefined || this.persona.profesion === null) {
      this.listaProfesiones.push(new Profesion('', '', '', '', ''));
      this.cantProfesion = 0;
    } else {
      this.listaProfesiones = this.persona.profesion;
      this.cantProfesion = this.listaProfesiones.length;
    }
    this.crearFormulario();
  }

  crearFormulario() {
    this.formaProfesion = new FormGroup({
      profesiones: new FormArray([])
    });
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.listaProfesiones.length; i++) {
      this.agregarProfesion(this.listaProfesiones[i]);
    }
  }

  agregarProfesion(profesion: Profesion) {
    if (!profesion) {
      profesion = new Profesion('', '', '', '', '');
    }
    // console.log(profesion);
    (this.formaProfesion.controls.profesiones as FormArray).push(
        new FormGroup({
          area: new FormControl({ value: profesion.area,  disabled: this.ver }),
          titulo: new FormControl({ value: profesion.titulo,  disabled: this.ver }),
          institucion: new FormControl({ value: profesion.institucion,  disabled: this.ver }),
          fecha: new FormControl({ value: profesion.fecha,  disabled: this.ver }),
          matProf: new FormControl({ value: profesion.matProf,  disabled: this.ver }),
        })
      );
    this.cantProfesion = this.formaProfesion.controls.profesiones.value.length;
    // console.log(this.cantProfesion);
  }

  guardar() {
    console.log(this.formaProfesion.value);
    if (!this.persona._id) {
      return;
    } else {
      // console.log(this.formaContacto.value);
      this.persona.profesion = this.formaProfesion.value.profesiones;
      const persona = JSON.stringify(this.persona);
      this.profesionService.guardarProfesion(JSON.parse(persona), this.tipo);
    }
  }

  quitarProfesion(i) {
    console.log(i);
  }

  editarProfesion() {
    this.router.navigate(['/' + this.tipo + '/editar/' + this.persona._id + '/5']);
  }

  imprimirEmpleado() {
    this.imprimir.emit(this.persona);
  }

}
