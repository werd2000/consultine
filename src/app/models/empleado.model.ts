import { Domicilio } from './domicilio.model';
import { Contacto } from './contacto.model';
import { Ssocial } from './ssocial.model';
import { Profesion } from './profesion.model';
import { EmpleadoInterface } from '../interfaces/empleado.interface';
import { Familia } from './familia.model';

export class EmpleadoProfile implements EmpleadoInterface {

    constructor(
        public apellido: string,
        public nombre: string,
        public tipo_doc: string,
        public nro_doc: string,
        public nacionalidad: string,
        public sexo: string,
        public fecha_nac: string,
        public fechaAlta: string,
        public fechaBaja: string,
        public borrado: boolean,
        public domicilio?: Domicilio,
        public contactos?: Contacto[],
        public profesion?: Profesion[],
        public ssocial?: Ssocial,
        public familiares?: Familia[],
        public img?: string,
        public observaciones?: string,
        public actualizadoEl?: string,
        public actualizadoPor?: string,
        public _id?: string
    ) { }

    getNombreCompleto() {
        return this.apellido + ' ' + this.nombre;
    }
}
