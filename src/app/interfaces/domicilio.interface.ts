// ====================================================
// Interface Domicilio permite la implementación rápida
// en otras interfaces o clases
// ====================================================

export interface DomicilioInterface {

    calle?: string;
    casa_nro?: string;
    barrio?: string;
    ciudad?: string;
    cp?: string;
    provincia?: string;
    pais?: string;
    lat?: number;
    lng?: number;

    /**
     * getDomicilioCompleto
     */
    getDomicilioCompleto();

}
