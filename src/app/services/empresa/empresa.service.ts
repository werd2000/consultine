import { Injectable } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  public establecimiento: Empresa;

  constructor(
    public afs: AngularFirestore,
    // public _subirArchivoService: SubirArchivoService,
  ) {
    this.cargarStorage();
  }

  actualizarEstablecimiento(empresa: Empresa) {
    return this.afs.collection('emmpresa').doc(empresa._id).set(empresa);
  }

  buscarEstablecimiento(campo: string, termino: string) {
    return this.afs.collection<Empresa>(
      'empresa', ref => ref.where(campo, '==', termino)
    ).valueChanges();
  }

  cambiarImagen( archivo: File, empresa: Empresa) {
    // this._subirArchivoService.subirArchivo(archivo, 'empresa', empresa)
    //   .then((resp: Empresa) => {
    //     });
  }

  cargarStorage() {
    // TODO: verificar si hay token y no usuario
    if ( localStorage.getItem('empresa')) {
      this.establecimiento = JSON.parse(localStorage.getItem('empresa'));
    } else {
      this.buscarEstablecimiento('cuit', '30710033575')
        .subscribe( empresa => {
          console.log(empresa);
          this.guardarStorage(empresa[0]);
        });
      this.establecimiento = JSON.parse(localStorage.getItem('empresa'));
    }
  }

  guardarStorage( empresa: Empresa ) {
    localStorage.setItem('empresa', JSON.stringify(empresa));
    this.establecimiento = empresa;
  }
}
