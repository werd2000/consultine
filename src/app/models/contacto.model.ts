import { ContactoInterface } from '../interfaces/contacto.interface';

export class Contacto implements ContactoInterface {

    constructor(
        public tipo = '',
        public valor = '',
        public observaciones = '',
    ) { }

    getContacto() {
        return `${ this.tipo } ${ this.valor }`;
    }
}
