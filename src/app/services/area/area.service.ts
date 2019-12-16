import { Injectable } from '@angular/core';
import { Area } from 'src/app/models/area.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import sweetAlert from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  private areasCollection: AngularFirestoreCollection<Area>;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
  ) {
    this.areasCollection = afs.collection<Area>('areas');
  }

  // ======================================================
  // Obtiene la lista de areas
  // ======================================================
  getAreas() {
    return this.areasCollection.valueChanges();
  }

  // =====================================================================
  // Obtiene un area por su id
  // =====================================================================
  getAreaId(id: string) {
    return this.afs.collection('areas').doc(id).valueChanges();
  }

  // =====================================================================
  // Borra un area por id
  // =====================================================================
  deleteArea(area: Area) {
    sweetAlert({
      title: 'Atención, está por borrar datos',
      text: 'Una vez borrados, no se podrán recuperar',
      icon: 'warning',
      buttons: ['Calcelar', 'Borrar'],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        this.afs.collection('areas').doc(area._id).delete()
        .then(resp => {
          sweetAlert ('Datos borrados', `Los datos del area ${ area.area } se borraron correctamente`, 'success');
        })
        .catch( err => {
          sweetAlert ('Los datos no se borraron', `Los datos del area ${ area.area } no se borraron`, 'warning');
        });
      }
    });
  }

  // =====================================================================
  // Crea un Area
  // =====================================================================
  createArea( area: Area ) {
    const id = this.afs.createId();
    area._id = id;
    this.afs.collection('areas').doc(id).set(area)
    .then( (resp: any) => {
      sweetAlert('Área registrada',
        `El área ${area.area} se creó correctamente`,
        'success');
      this.router.navigate([`area/${area._id}`]);
    })
    .catch(err => console.log(err));
  }

  // =====================================================================
  // Actualiza un area por Id
  // =====================================================================
  updateArea( area: Area ) {
    this.afs.collection('areas').doc(area._id).set(area)
      .then(resp => {
        sweetAlert ('Datos guardados', `Los datos del area ${ area.area } se guardaron correctamente`, 'success');
      })
      .catch( err => {
        sweetAlert ('Los datos no se guardaron', `Los datos del area ${ area.area } no se guardaron`, 'warning');
      });
  }
}
