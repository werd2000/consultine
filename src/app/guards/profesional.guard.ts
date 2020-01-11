import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/service.index';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  canActivate(): boolean {
    // console.log(this.usuarioService.usuario);
    if ( this.usuarioService.usuario.role === 'ROLE_PROF' || this.usuarioService.usuario.role === 'ROLE_ADMIN') {
      return true;
    } else {
      console.error('Acceso denegado. Ud. no es Profesional ni Admin');
      this.router.navigate(['/']);
      return false;
    }
  }
}
