import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import sweetAlert from 'sweetalert';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario;
  public menu;
  private existe: boolean;
  suscriptor: Subscription;

  constructor(
    public router: Router,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.cargarStorage();
    if (!this.estaLogueado()) {
      // Si se autentico con Google existe un authState
      this.afAuth.authState.subscribe( user => {
        if (!user) {
          return;
        }

        this.usuario = {
          nombre: user.displayName,
          email: user.email,
          password: ':)',
          role: 'ROLE_USER',
          google: true,
          img: user.photoURL,
          _id: user.uid,
        };
        // Me fijo si ese usuario de Google está en la BD
        this.getUsuarioEmail(user.email).subscribe( async usu => {
          if (usu === null || usu === undefined || usu.length === 0) {
            this.existe = false;
            // Si no existe lo creo en la BD
            await this.createUsuario(this.usuario)
              .then(() => {
                this.guardarStorage(this.usuario._id, 'token', this.usuario, 'menu');
                this.router.navigate(['/dashboard']);
                return;
              })
              .catch(() => console.log);
          } else { // Si existe el usuario lo cargo

            this.getUsuarioId(usu[0]._id)
              .subscribe ( (usuarioDb: Usuario) => {
                // console.log(usuarioDb);
                this.usuario.nombre = usuarioDb.nombre;
                this.usuario.role = usuarioDb.role;
                this.usuario.img = usuarioDb.img || user.photoURL;
                this.guardarStorage(this.usuario._id, 'token', this.usuario, 'menu');
                this.router.navigate(['/dashboard']);
              });
          }
        });
        this.router.navigate(['/dashboard']);
      });
      // this.usuariosCollection = afs.collection<Usuario>('usuarios');
      // this.cargarStorage();
    }
  }

  // Obtengo una colección de usuarios filtrado por email
  // El email debe ser único por lo que debe regresar un solo registro
  getUsuarioEmail( email: string ) {
    return this.afs.collection<Usuario>(
      'usuarios', ref => ref.where('email', '==', email)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Usuario;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // =====================================================================
  // Crea un usuario
  // =====================================================================
  createUsuario( usuario: Usuario) {
    // const id = this.afs.createId();
    // usuario._id = id;
    return this.afs.collection('usuarios').doc(usuario._id).set(usuario);
  }

  // =====================================================================
  // Login normal: usuarios y password
  // =====================================================================
  login( usuario: Usuario, recordar ) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.getUsuarioEmail(usuario.email).pipe(
      map( usu => {
        // console.log(usu);
        if ( usu.length !== 0 ) {
          if (usu[0].password === usuario.password) {
            this.usuario = usu[0];
            return usu;
          }
        }
      }));
  }

  // =====================================================================
  // Guarda datos en el Storage
  // =====================================================================
  guardarStorage( id: string, token: string, usuario, menu: any ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.menu = menu;
  }

  // =====================================================================
  // Carga los datos del Storage
  // =====================================================================
  cargarStorage() {
    // todo: verificar si hay token y no usuario
    if ( localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.usuario = null;
      this.menu = [];
    }
  }

  // =====================================================================
  // Login con Google
  // =====================================================================
  loginGoogle( token: string) {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    .then( (resp) => {
      console.log(resp);
      this.router.navigate(['/']);
    })
    .catch( (error) => {
      console.error(error);
      alert('ocurrió un error en la autenticación del usuario');
    });
  }

  // =====================================================================
  // Sale del sistema
  // =====================================================================
  logout() {
    if (this.usuario) {
      if (this.usuario.google) {
        this.logoutGoogle();
      }
      this.usuario = null;
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('menu');
      localStorage.removeItem('id');
    }

    this.router.navigate(['/login']);
  }

  logoutGoogle() {
    this.usuario = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    localStorage.removeItem('id');
    if (this.suscriptor) {
      this.suscriptor.unsubscribe();
    }
    this.afAuth.auth.signOut().then( () => {
      // console.log('User signed out.');
      this.router.navigate(['/login']);
    });
  }

  getUsuarioId( id: string ) {
    return this.afs.collection('usuarios').doc(id).valueChanges();
  }

  buscarUsuario( termino: string ) {
    return this.afs.collection<Usuario>(
      'usuarios', ref => ref.where('nombre', '==', termino)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Usuario;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  deleteUsuario(id: string) {
    sweetAlert('ATENCION', 'El administrador no permite eliminar el usuario', 'warning');
  }

  getUsuarios() {
    return this.afs.collection('usuarios').valueChanges();
  }

  // =====================================================================
  // Comprueba que está logueado
  // =====================================================================
  estaLogueado() {
    return ( this.usuario != null ) ? true : false;
  }

  // =====================================================================
  // Actualiza un usuario por Id
  // =====================================================================
  updateUsuario( usuario: Usuario ) {
    this.afs.collection('usuarios').doc(usuario._id).set(usuario)
      .then(resp => {
        sweetAlert ('Datos guardados', `Los datos del usuario ${ usuario.nombre } se guardaron correctamente`, 'success');
      })
      .catch( err => {
        sweetAlert ('Los datos no se guardaron', `Los datos del usuario ${ usuario.nombre } no se guardaron`, 'warning');
      });
  }

}
