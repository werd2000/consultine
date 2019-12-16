import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TipoContactoService } from 'src/app/services/service.index';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { TipoContacto } from 'src/app/models/TipoContacto.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipo-contactos',
  templateUrl: './tipo-contactos.component.html',
  styleUrls: ['./tipo-contactos.component.css']
})
export class TipoContactosComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'tipo',
    'observaciones',
    'acciones'
  ];
  dataSource: MatTableDataSource<any>;
  suscriptor: Subscription;
  cargando: boolean;
  totalTipos: number;
  tiposContactos: TipoContacto[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public tipoContactoService: TipoContactoService,
    public router: Router
  ) { }

  ngOnInit() {
    this.suscriptor = this.tipoContactoService.getTiposContactos()
      .subscribe( resp => {
        this.cargando = true;
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalTipos = resp.length;
        this.tiposContactos = resp;
        this.cargando = false;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.suscriptor.unsubscribe();
  }

  crearNuevoTipo() {
    this.router.navigate(['/tipo-contacto/nuevo']);
  }

  eliminar(tipo: TipoContacto ) {
    this.tipoContactoService.deleteTipoContacto(tipo);
  }

  ver(tipo: TipoContacto) {
    this.router.navigate(['/tipo-contacto/ver/' + tipo._id ])
  }

  editar(tipo: TipoContacto) {
    this.router.navigate(['/tipo-contacto/editar/' + tipo._id ])    
  }

}
