import { DomicilioInterface } from '../interfaces/domicilio.interface';

export class Domicilio implements DomicilioInterface {

    constructor(
        public calle = '',
        public casa = '',
        public barrio = '',
        public ciudad = '',
        public cp = '',
        public provincia = '',
        public pais = '',
        public lat = 0,
        public lng = 0,
    ) { }

    getDomicilioCompleto() {
        return `${ this.calle } ${ this.casa}`;
    }

}
