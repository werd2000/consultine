import { SsocialInterface } from '../interfaces/ssocial.interface';

export class Ssocial implements SsocialInterface {

    constructor(
        public obrasocial = '',
        public nafiliado = '',
    ) { }

    getSsocialompleto() {
        return `${this.obrasocial} ${ this.nafiliado}`;
    }
}
