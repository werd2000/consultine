import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { PacienteProfile } from '../../models/paciente.model';
import sweetAlert from 'sweetalert';
import { PacienteInterface } from 'src/app/interfaces/paciente.interface';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private pacienteDoc: AngularFirestoreDocument<PacienteProfile>;
  private pacientesCollection: AngularFirestoreCollection<PacienteProfile>;
  // public pacientes: PacienteProfile[] = [];
  public paciente: PacienteProfile;

  constructor(
    public router: Router,
    public afs: AngularFirestore,
  ) {
    this.pacientesCollection = afs.collection<PacienteProfile>('pacientes');
  }

  // ======================================================
  // Obtiene la lista de pacientes
  // ======================================================
  getPacientes() {
    return this.afs.collection('pacientes', ref => ref.orderBy('apellido'))
      .valueChanges();
  }

  // =====================================================================
  // Marca como borrado un paciente por id
  // =====================================================================
  deletePaciente(paciente: PacienteInterface) {
    sweetAlert({
      title: 'Atención, está por borrar datos',
      text: 'Una vez borrados, no se podrán recuperar',
      icon: 'warning',
      buttons: ['Calcelar', 'Borrar'],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        this.afs.collection('pacientes').doc(paciente._id).delete();
        sweetAlert('Los datos fueron borrados', {
          icon: 'success',
        });
      }
    });
  }

  getPacienteId(id: string) {
    return this.afs.collection('pacientes').doc(id).valueChanges()
      .pipe(
        map (
          (res: PacienteProfile) => res )
          );
  }

  // =====================================================================
  // Actualiza un paciente por Id
  // =====================================================================
  updatePaciente( paciente: PacienteInterface ) {
    this.afs.collection('pacientes').doc(paciente._id).set(paciente)
      .then(resp => {
        sweetAlert (
          'Datos guardados',
          `Los datos del paciente ${ paciente.apellido } ${ paciente.nombre } se guardaron correctamente`,
          'success');
      })
      .catch( err => {
        sweetAlert (
          'Los datos no se guardaron',
          `Los datos del paciente ${ paciente.apellido } ${ paciente.nombre } no se guardaron`,
          'warning');
      });
  }s

  // =====================================================================
  // Crea un paciente
  // =====================================================================
  createPaciente( paciente: PacienteProfile ) {
    const id = this.afs.createId();
    paciente.borrado = false;
    paciente._id = id;
    this.afs.collection('pacientes').doc(id).set(paciente)
    .then( (resp: any) => {
      sweetAlert('Paciente registrado',
        `El paciente ${paciente.apellido} ${paciente.nombre} se creó correctamente`,
        'success');
      this.router.navigate([`paciente/${paciente._id}`]);
    })
    .catch(err => console.log(err));
  }

}
