import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Contacto } from 'src/app/models/contacto.model';
import { TipoContactoService, PrintService } from 'src/app/services/service.index';
import { TipoContacto } from 'src/app/models/TipoContacto.model';
import { ContactoService } from 'src/app/services/contacto/contacto.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  @Input() persona;
  @Input() modo: string;
  @Input() tipo: string;
  formaContacto: FormGroup;
  contacto: Contacto;
  contactos: Contacto[] = [];
  listaTipoContactos: TipoContacto[];
  cantContactos: number;
  ver: boolean;

  constructor(
    public tipoContactoService: TipoContactoService,
    public contactoService: ContactoService,
    public router: Router,
    public location: Location,
    public printService: PrintService
  ) {
    this.tipoContactoService.getTiposContactos()
      .subscribe( resp => {
        this.listaTipoContactos = resp;
      });
  }

  ngOnInit() {
    if (this.modo === 'ver') {
      this.ver = true;
    }
    if (this.persona.contactos === undefined || this.persona.contactos === null) {
      this.contactos.push(new Contacto('', '',  ''));
      this.cantContactos = 0;
    } else {
      this.contactos = this.persona.contactos;
      this.cantContactos = this.contactos.length;
    }
    // console.log(this.contactos.contactos);
    this.crearFormulario();
  }

  crearFormulario() {
    this.formaContacto = new FormGroup({
      contactos: new FormArray([])
    });
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.contactos.length; i++) {
      this.agregarContacto(this.contactos[i]);
    }
  }

  agregarContacto(contacto: Contacto) {
    if (!contacto) {
      contacto = new Contacto('', '',  '');
    }
    (this.formaContacto.controls.contactos as FormArray).push(
        new FormGroup({
          tipo: new FormControl({ value: contacto.tipo,  disabled: this.ver }),
          valor: new FormControl({ value: contacto.valor,  disabled: this.ver }),
          observaciones: new FormControl({ value: contacto.observaciones,  disabled: this.ver })
        })
      );
    this.cantContactos = this.formaContacto.controls.contactos.value.length;
  }

  guardar() {
    if (!this.persona._id) {
      return;
    } else {
      this.persona.contactos = this.formaContacto.value.contactos;
      const persona = JSON.stringify(this.persona);
      this.contactoService.guardarContacto(JSON.parse(persona), this.tipo);
    }
  }

  editarContacto() {
    this.router.navigate(['/' + this.tipo + '/editar/' + this.persona._id + '/2']);
  }

  cancelar() {
    this.location.back();
  }

  quitarContacto(i: number) {
    const control = this.formaContacto.controls.contactos as FormArray;
    control.removeAt(i);
  }

}
