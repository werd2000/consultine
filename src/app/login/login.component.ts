import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario/usuario.service';
import { FormGroup } from '@angular/forms';


declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean;
  auth2: any;
  forma: FormGroup;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
  ) {
    this.recuerdame = false;
  }

  ngOnInit() {
    this.google_init();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  // ===================================================
  // Inicialización de servicio de Google
  // ===================================================
  google_init() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '923206693874-tcjjq0bqctjd7le4vpncue2nkk6vn97o.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
    });
  }

  login ( proveedor: string ) {
    this._usuarioService.loginGoogle(proveedor);
  }

  attachSignin( elemento ) {
    // this.router.navigate(['/dashboard']);
    console.log(elemento);
    this.auth2.attachClickHandler(elemento, {},
        function(googleUser) {
          document.getElementById('name').innerText = 'Signed in: ' +
              googleUser.getBasicProfile().getName();
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
