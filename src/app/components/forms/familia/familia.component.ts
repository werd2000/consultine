import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Familia } from 'src/app/models/familia.model';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { RELACIONES } from 'src/app/config/config';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PrintService, FamiliaService } from 'src/app/services/service.index';

@Component({
  selector: 'app-familia',
  templateUrl: './familia.component.html',
  styleUrls: ['./familia.component.css']
})
export class FamiliaComponent implements OnInit {

  @Input() persona;
  @Input() tipo: string;
  @Input() modo: string;
  familia: Familia;
  listaFamiliares: Familia[] = [];
  formaFamilia: FormGroup;
  ver: boolean;
  cantFamiliares: number;
  relaciones = RELACIONES;

  constructor(
    public router: Router,
    public location: Location,
    public printService: PrintService,
    public familiaService: FamiliaService,
  ) {  }

  ngOnInit() {
    if (this.modo === 'ver') {
      this.ver = true;
    }
    if (this.persona.familiares === undefined || this.persona.familiares === null) {
      this.listaFamiliares.push(new Familia('', '', '', '', ''));
      this.cantFamiliares = 0;
    } else {
      this.listaFamiliares = this.persona.familiares;
      this.cantFamiliares = this.listaFamiliares.length;
    }
    this.crearFormulario();
  }

  crearFormulario() {
    this.formaFamilia = new FormGroup({
      familiares: new FormArray([])
    });
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.listaFamiliares.length; i++) {
      this.agregarFamilia(this.listaFamiliares[i]);
    }
  }

  agregarFamilia(familia: Familia) {
    if (!familia) {
      familia = new Familia('', '',  '', '', '');
    }
    (this.formaFamilia.controls.familiares as FormArray).push(
        new FormGroup({
          relacion: new FormControl({
            value: familia.relacion ,  disabled: this.ver
          }),
          apellido: new FormControl({ value: familia.apellido ,  disabled: this.ver }),
          nombre: new FormControl({ value: familia.nombre,  disabled: this.ver }),
          nroDoc: new FormControl({ value: familia.nroDoc ,  disabled: this.ver }),
          observaciones: new FormControl({ value: familia.observaciones,  disabled: this.ver })
        })
      );
    this.cantFamiliares = this.formaFamilia.controls.familiares.value.length;
  }

  guardar() {
    if (!this.persona._id) {
      return;
    } else {
      // console.log(this.formaContacto.value);
      this.persona.familiares = this.formaFamilia.value.familiares;
      const persona = JSON.stringify(this.persona);
      this.familiaService.guardarFamilia(JSON.parse(persona), this.tipo);
    }
  }

  quitarFamilia(i: number) {
    const control = this.formaFamilia.controls.familiares as FormArray;
    control.removeAt(i);
  }

  cancelar() {
    this.location.back();
  }

  editarFamilia() {
    this.router.navigate(['/' + this.tipo + '/editar/' + this.persona._id + '/3']);
  }

}
