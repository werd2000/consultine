import { Usuario } from './usuario.interface';
import { PacienteInterface } from './paciente.interface';
import { EmpleadoInterface } from './empleado.interface';

export class TurnoInterface {

    area: string;
    Profesional: EmpleadoInterface;
    fechaInicio: string;
    horaInicio: string;
    fechaFin: string;
    horaFin: string;
    duracion: string;
    idPaciente: string;
    paciente: PacienteInterface;
    creadoPor: Usuario;
    creacion: string;
    actualizado: string;
    estado: string;
    observaciones?: string;
    _id?: string;

}
