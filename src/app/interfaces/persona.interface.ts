// ====================================================
// Interface Persona permite la implementación rápida
// en otras interfaces o clases
// ====================================================

export interface PersonaInterface {
    apellido: string;
    nombre: string;
    tipo_doc: string;
    nro_doc: string;
    nacionalidad: string;
    sexo: string;
    fecha_nac: string;
    borrado: boolean;
    fechaAlta: string;
    actualizadoEl?: string;
    actualizadoPor?: string;
    observaciones?: string;
    img?: string;
    _id?: string;
}
