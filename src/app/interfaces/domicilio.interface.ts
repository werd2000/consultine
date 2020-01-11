import { Countries } from '../globals/countries.enum';

// ====================================================
// Interface Domicilio permite la implementación rápida
// en otras interfaces o clases
// ====================================================

export interface DomicilioInterface {

    calle?: string;
    casa?: string;
    barrio?: string;
    ciudad?: string;
    cp?: string;
    provincia?: string;
    pais?: Countries;
    lat?: number;
    lng?: number;

}
