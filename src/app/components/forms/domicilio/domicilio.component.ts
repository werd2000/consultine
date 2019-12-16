import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Domicilio } from 'src/app/models/domicilio.model';
import { ERRORES } from 'src/app/config/config';
import { Router } from '@angular/router';
import { DomicilioService, PrintService } from 'src/app/services/service.index';
import { Location } from '@angular/common';
import { PersonaInterface } from 'src/app/interfaces/persona.interface';

@Component({
  selector: 'app-domicilio',
  templateUrl: './domicilio.component.html',
  styleUrls: ['./domicilio.component.css']
})
export class DomicilioComponent implements OnInit {

  @Input() persona;
  @Input() tipo: string;
  @Input() modo: string;
  @Output() imprimir: EventEmitter<PersonaInterface>;
  formaDomicilio: FormGroup;
  domicilio: Domicilio;
  error = ERRORES;
  ver: boolean;

  constructor(
    public router: Router,
    public domicilioService: DomicilioService,
    private location: Location,
    public printService: PrintService
  ) {
    this.imprimir = new EventEmitter();
  }

  ngOnInit() {
    if (this.modo === 'ver') {
      this.ver = true;
    }
    if (this.persona.domicilio === undefined || this.persona.domicilio === null) {
      this.domicilio = new Domicilio(
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        0,
        0);
    } else {
      this.domicilio = this.persona.domicilio;
    }
    this.crearFormulario();
  }

  crearFormulario() {
    this.formaDomicilio = new FormGroup({
      calle: new FormControl(
        { value: this.domicilio.calle,
          disabled: this.ver
        }
        ),
      casa: new FormControl(
        { value: this.domicilio.casa,
          disabled: this.ver
        }
        ),
      barrio: new FormControl(
        { value: this.domicilio.barrio,
          disabled: this.ver
        }
        ),
      ciudad: new FormControl(
        { value: this.domicilio.ciudad,
          disabled: this.ver
        }
        ),
      cp: new FormControl(
        { value: this.domicilio.cp,
          disabled: this.ver
        }
        ),
      provincia: new FormControl(
        { value: this.domicilio.provincia,
          disabled: this.ver
        }
        ),
      pais: new FormControl({
        value: this.domicilio.pais,
        disabled: this.ver
        }
        ),
    });
  }

  guardar() {
    if (!this.persona._id) {
      return;
    } else {
      this.persona.domicilio = this.formaDomicilio.value;
      const persona = JSON.stringify(this.persona);
      this.domicilioService.guardarDomicilio(JSON.parse(persona), this.tipo);
    }
  }

  editarDomicilio() {
    this.router.navigate(['/' + this.tipo + '/editar/' + this.persona._id + '/1']);
  }

  cancelar() {
    this.location.back();
  }

  imprimirPersona() {
    this.imprimir.emit(this.persona);
  }

}
