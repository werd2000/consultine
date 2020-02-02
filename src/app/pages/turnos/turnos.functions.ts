import { UsuarioService, PacienteService, PersonalService } from 'src/app/services/service.index';
import * as moment from 'moment';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

export class TurnosFunctions {

  data: [] = [];

    constructor(
        private usuarioService: UsuarioService,
        private pacienteService: PacienteService,
        private personalService: PersonalService
    ) {}

    paraMostrar(turno, index, array) {
      console.log(turno.idPaciente);
      forkJoin(
          [this.pacienteService.getPacienteId(turno.idPaciente),
          this.usuarioService.getUsuarioId(turno.creadoPor),
          this.personalService.getPersonalId(turno.idProfesional)]
      ).subscribe(([paciente, usuario, profesional]) => {
        console.log(paciente);
        console.log(usuario);
        console.log(profesional);
        array[index].paciente = paciente;
        array[index].usuario = usuario;
        array[index].profesional = profesional;
      },
      error => {
        console.log(error);
      });

      // const arr = this.configuraEstado(array, index, turno);

      const inicio = moment(turno.horaInicio, 'HH:mm');
      const fin = moment(turno.horaFin, 'HH:mm');
      // array[index].duracion = this.calcularDuracion(inicio, fin);

      const top = array[index].duracion;

      // if (index === 0) {
      //   array[index].top = top  + 'px';
      // } else {
      //   array[index].top = (top - (durAcum + (30 * index)))  + 'px';
      // }
      return array;

    }

    configuraPaciente(turno, index, array) {
      this.pacienteService.getPacienteId(turno.idPaciente)
      .subscribe( pac => {
        array[index].paciente = pac;
      });
    }

    configuraProfesional(turno, index, array) {
      this.personalService.getPersonalId(turno.idProfesional)
      .subscribe( prof => {
        array[index].profesional = prof;
      });
    }

    configuraUsuario(turno, index, array) {
      this.usuarioService.getUsuarioId(turno.creadoPor)
      .subscribe( usu => {
        array[index].usuario = usu;
      });
    }

    configurarTop(turno, index, array) {
      const inicio = moment('08:00', 'HH:mm');
      const fin = moment(turno.horaInicio, 'HH:mm');
      let duracion = moment.duration(fin.diff(inicio)).minutes() * 2;
      duracion += moment.duration(fin.diff(inicio)).hours() * 60 * 2;
      console.log(duracion);
      if (duracion >= 900) {
        array[index].top = (duracion - 300) + 'px';
      } else {
        array[index].top = duracion + 'px';
      }
    }

    configuraEstado(turno, index, array) {
      switch (turno.estado) {
        case 'PROGRAMADO':
          array[index].estilo = 'turno-programado';
          array[index].estiloText = 'text-primary';
          break;
        case 'RE PROGRAMADO':
          array[index].estilo = 'turno-reprogramado';
          array[index].estiloText = 'text-primary';
          break;
        case 'DEMORADO':
          array[index].estilo = 'turno-demorado';
          array[index].estiloText = 'text-warning';
          break;
        case 'CANCELADO POR PACIENTE':
          array[index].estilo = 'turno-cancelo-paciente';
          array[index].estiloText = 'text-danger';
          break;
        case 'CANCELADO POR PROFESIONAL':
          array[index].estilo = 'turno-cancelo-profesional';
          array[index].estiloText = 'text-info';
          break;
        case 'PACIENTE ESPERANDO':
          array[index].estilo = 'turno-paciente-esperando';
          array[index].estiloText = 'text-info';
          break;
        case 'REALIZADO':
          array[index].estilo = 'turno-realizado';
          array[index].estiloText = 'text-success';
          break;
        default:
          array[index].estilo = 'border-primary';
          array[index].estiloText = 'text-primary';
          break;
      }
      return array;
    }

    calcularDuracion(turno, index, array) {
      const inicio = moment(turno.horaInicio, 'HH:mm');
      const fin = moment(turno.horaFin, 'HH:mm');
      let duracion = moment.duration(fin.diff(inicio)).minutes();
      if (duracion === 0) {
          duracion = moment.duration(fin.diff(inicio)).hours();
          if (duracion === 1) {
            duracion = 60;
          }
      }
      array[index].duracion = duracion;
    }

}
