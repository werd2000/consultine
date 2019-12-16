import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Turno } from 'src/app/models/turno.model';
import sweetAlert from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private turnosCollection: AngularFirestoreCollection<Turno>;

  constructor(
    private afs: AngularFirestore,
  ) {  }

  // ======================================================
  // Obtiene la lista de turnos
  // ======================================================
  getTurnos() {
    return this.afs.collection<Turno>('turnos').valueChanges();
  }

  // ======================================================
  // Crea un turno
  // ======================================================
  createTurno(turno) {
    const id = this.afs.createId();
    turno._id = id;
    this.afs.collection('turnos').doc(id).set(turno)
      .then( () => {
        sweetAlert ('Turno asignado', `Los datos del turno ${ turno.idPaciente } se agregó correctamente`, 'success');
      });
  }

  // =====================================================================
  // Obtiene un turno por su id
  // =====================================================================
  obtenerTurnoId(id: string) {
    return this.afs.collection('turnos').doc(id).valueChanges();
  }

  // =====================================================================
  // Borra un turno por id
  // =====================================================================
  deleteTurno(turno: Turno) {
    return this.afs.collection('turnos').doc(turno._id).delete();
  }

  // =====================================================================
  // Actualiza un turno por Id
  // =====================================================================
  updateTurno( turno ) {
    this.afs.collection('turnos').doc(turno._id).set(turno)
      .then(resp => {
        sweetAlert ('Datos guardados', `Los datos del turno ${ turno.idPaciente } se guardaron correctamente`, 'success');
      })
      .catch( err => {
        sweetAlert ('Los datos no se guardaron', `Los datos del turno ${ turno.idPaciente } no se guardaron`, 'warning');
      });
  }

  // =====================================================================
  // Busca turnos por un término de búsqueda
  // =====================================================================
  searchTurnos(campo: string, termino: string ) {
    return this.afs.collection<Turno>(
      'turnos', ref => ref.where(campo, '==', termino)
    ).valueChanges();
  }

  // =====================================================================
  // Busca turnos por fecha y idProfesional
  // =====================================================================
  getTurnosFechaProfesional(fecha: string, idProfesional: string ) {
    return this.afs.collection<Turno>(
      'turnos', ref => ref.where('fechaInicio', '==', fecha).where('idProfesional', '==', idProfesional)
    ).valueChanges();
  }
}
