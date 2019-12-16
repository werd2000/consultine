import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { EmpleadoProfile } from 'src/app/models/empleado.model';
import { Router } from '@angular/router';
import sweetAlert from 'sweetalert';


@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  private empleadoDoc: AngularFirestoreDocument<EmpleadoProfile>;
  private empleadosCollection: AngularFirestoreCollection<EmpleadoProfile>;
  public empleados: EmpleadoProfile[] = [];
  public empleado: EmpleadoProfile;

  constructor(
    public router: Router,
    public afs: AngularFirestore,
  ) {
    this.empleadosCollection = afs.collection<EmpleadoProfile>('profesionales');
  }

  // ======================================================
  // Obtiene la lista de profesionales
  // ======================================================
  getPersonal() {
    // return this.empleadosCollection.valueChanges();
    return this.afs.collection('profesionales', ref => ref.orderBy('apellido')).valueChanges();
  }

  getPersonalId(id: string) {
    return this.afs.collection('profesionales').doc(id).valueChanges();
  }

  // =====================================================================
  // Marca como borrado un profesional por id
  // =====================================================================
  deletePersonal(profesional: EmpleadoProfile) {
    sweetAlert({
      title: 'Atención, está por borrar datos',
      text: 'Una vez borrados, no se podrán recuperar',
      icon: 'warning',
      buttons: ['Calcelar', 'Borrar'],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        this.afs.collection('profesionales').doc(profesional._id).delete()
          .then(resp => {
            sweetAlert ('Datos borrados', `Los datos del profesional ${ profesional.apellido } se borraron correctamente`, 'success');
          })
          .catch( err => {
            sweetAlert ('Los datos no se borraron', `Los datos del profesional ${ profesional.apellido } no se borraron`, 'warning');
          });
      }
    });
  }

  // =====================================================================
  // Crea un profesional
  // =====================================================================
  createPersonal( profesional: EmpleadoProfile ) {
    const id = this.afs.createId();
    profesional._id = id;
    this.afs.collection('profesionales').doc(id).set(profesional)
      .then( (resp: any) => {
        sweetAlert('Personal registrado',
          `El personal ${profesional.apellido} ${profesional.nombre} se creó correctamente`,
          'success');
        this.router.navigate([`empleado/${profesional._id}`]);
      })
      .catch(err => console.log(err));
  }

  // =====================================================================
  // Busca un profesional por un término de búsqueda
  // =====================================================================
  buscarPersonal(campo: string, termino: string ) {
    return this.afs.collection<EmpleadoProfile>(
      'profesionales', ref => ref.where(campo, '==', termino)
    ).valueChanges();
  }

  // =====================================================================
  // Actualiza un profesional por Id
  // =====================================================================
  updatePersonal( profesional: EmpleadoProfile ) {
    this.afs.collection('profesionales').doc(profesional._id).set(profesional)
      .then(resp => {
        sweetAlert ('Datos guardados', `Los datos del profesional ${ profesional.apellido } se guardaron correctamente`, 'success');
      })
      .catch( err => {
        sweetAlert ('Los datos no se guardaron', `Los datos del profesional ${ profesional.apellido } no se guardaron`, 'warning');
      });
  }

  // =====================================================================
  // Busca un profesional por Id
  // =====================================================================
  existePersonalId(id: string) {
    this.empleadoDoc = this.afs.doc<EmpleadoProfile>(`profesionales/${id}`);
    return this.empleadoDoc.valueChanges();
  }

  // =====================================================================
  // Cambia la imagen de un profesional
  // =====================================================================
  cambiarImagen( archivo: File, profesional: EmpleadoProfile) {
    // this._subirArchivoService.subirArchivo(archivo, 'paciente', paciente)
      // .then((resp: PacienteProfile) => {
        // this.guardarStorage(resp.email, '', resp, '');
        // });
  }
}