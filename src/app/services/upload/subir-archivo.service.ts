import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Usuario } from 'src/app/models/usuario.model';
import { PacienteProfile } from '../../models/paciente.model';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpleadoProfile } from 'src/app/models/empleado.model';
import { PersonaInterface } from 'src/app/interfaces/persona.interface';


@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  private CARPETA_IMAGENES = 'img';

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore
  ) { }

  // subirArchivo( archivo: File, tipo: string, objeto: Usuario | PacienteProfile | EmpleadoProfile | Empresa) {
  subirArchivo( archivo: File, tipo: string, objeto: PersonaInterface | Usuario | Empresa) {
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    let nombreArchivo;
    switch (tipo) {
      case 'usuario':
        nombreArchivo = `${objeto._id}-${new Date().getMilliseconds()}.${extension}`;
        break;

      case 'profesional':
        nombreArchivo = `${objeto._id}-${new Date().getMilliseconds()}.${extension}`;
        break;

      case 'paciente':
        nombreArchivo = `${objeto._id}-${new Date().getMilliseconds()}.${extension}`;
        break;

      case 'empresa':
        nombreArchivo = `${objeto._id}-${new Date().getMilliseconds()}.${extension}`;
        break;

      case 'informe':
        nombreArchivo = archivo.name;
        break;

      default:
        break;
    }

    if (objeto.img) {
      const objet = objeto.img.split('/');
      const obje = objet[7].split('?');
      const obj = obje[0].split('%2F');
      const ob = obj.join('/');
      const desertRef = this.storage.ref(`${ob}`);
      desertRef.delete()
        .subscribe(r => {
          console.log(r);
        });
    }

    const ref = this.storage.ref(`/${this.CARPETA_IMAGENES}/${tipo}/${nombreArchivo}`);
    return ref.put(archivo)
      .then( resp => {
        resp.ref.getDownloadURL().then( r => {
          objeto.img = r;
          this.guardarImagen(tipo, objeto);
        });
        return objeto;
      });

  }

  // private guardarImagen(tipo: string, objeto: Usuario | PacienteProfile | EmpleadoProfile | Empresa) {
  private guardarImagen(tipo: string, objeto: PersonaInterface | Usuario | Empresa) {
    const aGuardar = JSON.stringify(objeto);
    const persona = JSON.parse(aGuardar);
    switch (tipo) {
      case 'usuario':
        return this.afs.collection('usuarios').doc(objeto._id).set(persona);
        // break;
      case 'profesional':
        return this.afs.collection('profesionales').doc(objeto._id).set(persona);
        // break;
      case 'paciente':
        return this.afs.collection('pacientes').doc(objeto._id).set(persona);
        // break;
      case 'empresa':
        return this.afs.collection('establecimiento').doc(objeto._id).set(persona);
      default:
        // return null;
        break;
    }
  }

}
