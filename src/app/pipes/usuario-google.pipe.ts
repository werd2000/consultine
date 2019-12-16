import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usuarioGoogle'
})
export class UsuarioGooglePipe implements PipeTransform {

  transform(google: boolean): any {

    if (google) {
        return 'Sí';
    } else {
        return 'No';
    }
  }

}
