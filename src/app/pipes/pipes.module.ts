import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { RoleUsuarioPipe } from './role-usuario.pipe';
import { UsuarioGooglePipe } from './usuario-google.pipe';
import { PacientePipe } from './paciente.pipe';
import { PersonalPipe } from './personal.pipe';
// import { EstadoPacientePipe } from './estado-paciente.pipe';
// import { AreaProfesionalPipe } from './area-profesional.pipe';
// import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  imports: [
  ],
  declarations: [
    ImagenPipe,
    RoleUsuarioPipe,
    UsuarioGooglePipe,
    PacientePipe,
    PersonalPipe
    // EstadoPacientePipe,
    // AreaProfesionalPipe,
    // UsuarioPipe,
    // SafeHtmlPipe
  ],
  exports: [
    ImagenPipe,
    RoleUsuarioPipe,
    UsuarioGooglePipe,
    PacientePipe,
    PersonalPipe
    // EstadoPacientePipe,
    // AreaProfesionalPipe,
    // UsuarioPipe,
    // SafeHtmlPipe
  ]
})
export class PipesModule { }
