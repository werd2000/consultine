import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './guards/login.guard';

const APPROUTES: Routes = [
    { path: '',
      component: PagesComponent,
      canActivate: [ LoginGuard ],
      // loadChildren: './pages/pages.module#PagesModule'
    },
    { path: 'login', component: LoginComponent },
];

export const APP_ROUTES = RouterModule.forRoot(APPROUTES, {useHash: true});
