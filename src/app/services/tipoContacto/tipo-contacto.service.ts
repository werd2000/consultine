import { Injectable } from '@angular/core';
import { TipoContacto } from 'src/app/models/TipoContacto.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import sweetAlert from 'sweetalert';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TipoContactoService {

  private tiposContactosCollection: AngularFirestoreCollection<TipoContacto>;

  constructor(
    private afs: AngularFirestore,
    public router: Router
  ) {
    this.tiposContactosCollection = afs.collection<TipoContacto>('tipo-contacto');
  }

  deleteTipoContacto(tipo: TipoContacto) {
    sweetAlert({
      title: 'Atención, está por borrar datos',
      text: 'Una vez borrados, no se podrán recuperar',
      icon: 'warning',
      buttons: ['Calcelar', 'Borrar'],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        this.afs.collection('tipo-contacto').doc(tipo._id).delete()
          .then(resp => {
            sweetAlert ('Datos borrados', `Los datos del tipo de contacto ${ tipo.tipo } se borraron correctamente`, 'success');
          })
          .catch( err => {
            sweetAlert ('Los datos no se borraron', `Los datos del tipo de contacto ${ tipo.tipo } no se borraron`, 'warning');
          });
        }
      });
    }

  // =====================================================================
  // Crea un Tipo de Contacto
  // =====================================================================
  createTipo( tipo: TipoContacto ) {
    const id = this.afs.createId();
    tipo._id = id;
    this.afs.collection('tipo-contacto').doc(id).set(tipo)
    .then( (resp: any) => {
      sweetAlert('Tipo de Contacto registrado',
        `El tipo de contacto ${tipo.tipo} se creó correctamente`,
        'success');
      this.router.navigate([`tipo-contacto/${tipo._id}`]);
    })
    .catch(err => console.log(err));
  }

  // ======================================================
  // Obtiene la lista de Tipos de Contactos
  // ======================================================
  getTiposContactos() {
    return this.tiposContactosCollection.valueChanges();
  }

  // =====================================================================
  // Obtiene un tipo de contacto por su id
  // =====================================================================
  getTipoContactoId(id: string) {
    return this.afs.collection('tipo-contacto').doc(id).valueChanges();
  }

  // =====================================================================
  // Actualiza un Tipo de Contacto por Id
  // =====================================================================
  updateTipoContacto( tipo: TipoContacto ) {
    this.afs.collection('tipo-contacto').doc(tipo._id).set(tipo)
      .then(resp => {
        sweetAlert ('Datos guardados', `Los datos del tipo de contacto ${ tipo.tipo } se guardaron correctamente`, 'success');
      })
      .catch( err => {
        sweetAlert ('Los datos no se guardaron', `Los datos del tipo de contacto ${ tipo.tipo } no se guardaron`, 'warning');
      });
  }
}