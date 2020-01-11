import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleUsuario'
})
export class RoleUsuarioPipe implements PipeTransform {

  transform(role: string): any {

    if (!role) {
      return;
    }

    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrador';

      case 'ROLE_USER':
        return 'Usuario';

      case 'ROLE_PROF':
          return 'Profesional';

      default:
        return 'Usuario';
    }
  }

}
