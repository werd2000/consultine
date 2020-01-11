import { DomicilioInterface } from '../interfaces/domicilio.interface';
import { Countries } from '../globals/countries.enum';

export class Domicilio implements DomicilioInterface {

    constructor(
        public calle = '',
        public casa = '',
        public barrio = '',
        public ciudad = '',
        public cp = '',
        public provincia = '',
        // public pais = 'Argentina',
        public lat = 0,
        public lng = 0,
    ) { }

    getDomicilioCompleto() {
        return `${ this.calle } ${ this.casa}`;
    }

}
