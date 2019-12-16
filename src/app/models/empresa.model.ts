export class Empresa {
    constructor(
        public nombre: string,
        public alias: string,
        public cuit: string,
        public email?: string,
        public img?: string,
        public _id?: string
    ) { }
}
