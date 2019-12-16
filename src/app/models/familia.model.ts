import { FamiliaInterface } from '../interfaces/familia.interface';

export class Familia implements FamiliaInterface {

    constructor(
        public relacion = '',
        public apellido = '',
        public nombre = '',
        public nroDoc = '',
        public observaciones = ''
    ) { }
}
