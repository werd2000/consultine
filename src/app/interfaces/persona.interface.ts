import { Countries } from '../globals/countries.enum';

// ====================================================
// Interface Persona permite la implementación rápida
// en otras interfaces o clases
// ====================================================

export interface PersonaInterface {
    apellido: string;
    nombre: string;
    tipoDoc: string;
    nroDoc: string;
    nacionalidad: Countries;
    sexo: string;
    fechaNac: string;
    borrado: boolean;
    fechaAlta: string;
    actualizadoEl?: string;
    actualizadoPor?: string;
    observaciones?: string;
    img?: string;
    _id?: string;
}
