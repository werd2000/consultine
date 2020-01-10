import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { PacienteComponent } from './pacientes/paciente.component';
import { LoginGuard } from '../guards/login.guard';
import { PagesComponent } from './pages.component';
import { UsuariosComponent } from './usuario/usuarios.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { PersonalComponent } from './personal/personal.component';
import { EmpleadoComponent } from './personal/empleado.component';
import { AreasComponent } from './areas/areas.component';
import { AreaComponent } from './areas/area.component';
import { TipoContactosComponent } from './tipo-contacto/tipo-contactos.component';
import { TipoContactoComponent } from './tipo-contacto/tipo-contacto.component';
import { TurnosComponent } from './turnos/turnos.component';
import { AddTurnoComponent } from './turnos/add-turno.component';
import { TurnosPacienteComponent } from './pacientes/turnos-paciente.component';
import { PersonalTurnosComponent } from './personal/personal-turnos.component';
import { AddTurnoQuickComponent } from './turnos/add-turno-quick.component';


const PAGESROUTES: Routes = [
    {
        path: '',
        // redirectTo: '/dashboard',
        // pathMatch: 'full',
        component: PagesComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [ LoginGuard ]
            },
            {
                path: 'pacientes',
                component: PacientesComponent,
                canActivate: [ LoginGuard ],
                data: { titulo: 'Lista de pacientes' }
            },
            { path: 'paciente/:id', component: PacienteComponent, data: { titulo: 'Creación de paciente' } },
            { path: 'paciente/editar/:id/:tab', component: PacienteComponent, data: { titulo: 'Edición de paciente' } },
            { path: 'paciente/editar/:id', component: PacienteComponent, data: { titulo: 'Edición de paciente' } },
            { path: 'paciente/ver/:id', component: PacienteComponent, data: { titulo: 'Ver paciente' } },
            {
                path: 'personal',
                component: PersonalComponent,
                canActivate: [ LoginGuard ],
                data: { titulo: 'Lista de personal' }
            },
            { path: 'empleado/:id', component: EmpleadoComponent, data: { titulo: 'Creación de empleado' } },
            { path: 'empleado/ver/:id', component: EmpleadoComponent, data: { titulo: 'Ver empleado' } },
            { path: 'empleado/editar/:id/:tab', component: EmpleadoComponent, data: { titulo: 'Edición de empleado' } },
            { path: 'empleado/editar/:id', component: EmpleadoComponent, data: { titulo: 'Edición de empleado' } },

            { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Lista de usuarios' } },
            { path: 'usuario/ver/:id', component: UsuarioComponent, data: { titulo: 'Ver usuario' } },
            { path: 'usuario/editar/:id', component: UsuarioComponent, data: { titulo: 'Editar usuario' } },

            { path: 'areas', component: AreasComponent, data: { titulo: 'Áreas de servicio' } },
            { path: 'area/:id', component: AreaComponent, data: { titulo: 'Nueva área' } },
            { path: 'area/ver/:id', component: AreaComponent, data: { titulo: 'Ver área' } },
            { path: 'area/editar/:id', component: AreaComponent, data: { titulo: 'Editar área' } },

            { path: 'tipo-contactos', component: TipoContactosComponent, data: { titulo: 'Administración de contactos' } },
            { path: 'tipo-contacto/:id', component: TipoContactoComponent, data: { titulo: 'Edición de contactos' } },
            { path: 'tipo-contacto/ver/:id', component: TipoContactoComponent, data: { titulo: 'Edición de contactos' } },
            { path: 'tipo-contacto/editar/:id', component: TipoContactoComponent, data: { titulo: 'Edición de contactos' } },

            { path: 'turnos', component: TurnosComponent, data: { titulo: 'Turnos' } },
            { path: 'turno/:id', component: AddTurnoQuickComponent, data: { titulo: 'Turnos' } },

            { path: 'turnos/paciente/:id', component: TurnosPacienteComponent, data: { titulo: 'Turnos del paciente' } },
            { path: 'turnos/personal/:id', component: PersonalTurnosComponent, data: { titulo: 'Turnos del personal' } },

            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
    },
];

export const PAGES_ROUTES = RouterModule.forChild(PAGESROUTES);
