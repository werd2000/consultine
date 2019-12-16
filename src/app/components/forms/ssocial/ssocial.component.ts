import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ssocial } from 'src/app/models/ssocial.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PrintService } from '../../../services/print/print.service';
import { SsocialService } from 'src/app/services/service.index';
import { PersonaInterface } from 'src/app/interfaces/persona.interface';

@Component({
  selector: 'app-ssocial',
  templateUrl: './ssocial.component.html',
  styleUrls: ['./ssocial.component.css']
})
export class SsocialComponent implements OnInit {

  @Input() persona;
  @Input() tipo: string;
  @Input() modo: string;
  @Output() imprimir: EventEmitter<PersonaInterface>;
  public ver: boolean;
  public ssocial: Ssocial;
  public formaSsocial: FormGroup;

  constructor(
    public location: Location,
    public router: Router,
    public printService: PrintService,
    public ssocialService: SsocialService
  ) {
    this.imprimir = new EventEmitter();
  }

  ngOnInit() {
    if (this.modo === 'ver') {
      this.ver = true;
    }
    if (this.persona.ssocial === undefined || this.persona.ssocial === null) {
      this.ssocial = new Ssocial('', '');
    } else {
      this.ssocial = this.persona.ssocial;
    }
    this.crearFormulario();
  }

  crearFormulario() {
    this.formaSsocial = new FormGroup({
      obrasocial: new FormControl({
        value: this.ssocial.obrasocial,
        disabled: this.ver
      }),
      nafiliado: new FormControl({
        value: this.ssocial.nafiliado,
      disabled: this.ver
    })
    });
  }

  guardar() {
    if (!this.persona._id) {
      return;
    } else {
      this.persona.ssocial = this.formaSsocial.value;
      const persona = JSON.stringify(this.persona);
      this.ssocialService.guardarSsocial(JSON.parse(persona), this.tipo);
    }
  }

  cancelar() {
    this.location.back();
  }

  editarSsocial() {
    this.router.navigate(['/' + this.tipo + '/editar/' + this.persona._id + '/4']);
  }

  imprimirPaciente() {
    this.imprimir.emit(this.persona);
  }

}
