export class Turno {

    constructor(
        public area: string,
        public idProfesional: string,
        public fechaInicio: string,
        public horaInicio: string,
        public fechaFin: string,
        public horaFin: string,
        public idPaciente: string,
        public creadoPor: string,
        public creacion: string,
        public actualizado: string,
        public estado: string,
        public observaciones?: string,
        public _id?: string,
    ) { }

}