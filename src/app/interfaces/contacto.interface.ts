// ====================================================
// Interface Contacto permite la implementación rápida
// en otras interfaces o clases
// ====================================================

export interface ContactoInterface {

    // Indica el tipo de contacto: Email, Tel, Cel, etc
    tipo?: string;
    // El valor del contacto
    valor?: string;
    observaciones?: string;

}
