import { UsuarioService, PacienteService, PersonalService } from 'src/app/services/service.index';
import * as moment from 'moment';

export class TurnosFunctions {

    constructor(
        private usuarioService: UsuarioService,
        private pacienteService: PacienteService,
        private personalService: PersonalService
    ) {}

    paraMostrar(turno, index, array) {
      this.pacienteService.getPacienteId(turno.idPaciente)
          .subscribe( resp => {
            array[index].paciente = resp;
          });

      this.usuarioService.getUsuarioId(turno.creadoPor)
        .subscribe( resp => {
          array[index].usuario = resp;
        });

      this.personalService.getPersonalId(turno.idProfesional)
        .subscribe( resp => {
          array[index].profesional = resp;
        });

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
          case 'REALIZADO':
            array[index].estilo = 'turno-realizado';
            array[index].estiloText = 'text-success';
            break;
          default:
            array[index].estilo = 'border-primary';
            array[index].estiloText = 'text-primary';
            break;
        }

        let inicio = moment(turno.horaInicio,'HH:mm');
        let fin = moment(turno.horaFin,'HH:mm');
        let duracion = moment.duration(fin.diff(inicio)).minutes();
        if (duracion === 0) {
          duracion = moment.duration(fin.diff(inicio)).hours();
          if (duracion === 1) {
            duracion = 60;
          }
        }        
        array[index].duracion = duracion;

        const grilla = [];
        let horaInicial = '08:00';
        let varTop = 145;
        for ( var i = 0; i <= 48; i++) {
          grilla.push(
            { hora: moment(horaInicial,'HH:mm').add(i * 5, 'm').format('HH:mm'),
              top: varTop + (i * 10)
            }
          );
        }
        horaInicial = '15:30';
        varTop = 645;
        for ( var i = 0; i <= 48; i++) {
          grilla.push(
            { hora: moment(horaInicial,'HH:mm').add(i * 5, 'm').format('HH:mm'),
              top: varTop + (i * 10)
            }
          );
        }
        console.log(grilla[81]);
        
        
        const resultado = grilla.find( horario => horario.hora === turno.horaInicio );
        if (turno.horaInicio == '18:10') {
          console.log(resultado, turno.horaInicio);
        }
                
        let top = resultado.top;
        
        if (index != 0) {
          // top = top - (duracion * 2 * index);
          // array[index].top = top - duracion  + 'px';
          array[index].top = top + 'px';
          if (turno.horaInicio == '18:10') {
            console.log(index);
            console.log(duracion);            
            console.log('top - (duracion * 2 * index)', top);
          }
        }
        
        array[index].top = top  + 'px';
        
    }

}