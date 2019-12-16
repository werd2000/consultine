import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService, PrintService, ExportPdfService, CopyService, CsvService } from 'src/app/services/service.index';
import { Usuario } from 'src/app/models/usuario.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import sweetAlert from 'sweetalert';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  cargando = false;
  listaUsuarios;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'imagen',
    'nombre',
    'email',
    'role',
    'google',
    'acciones'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    public usuarioService: UsuarioService,
    public router: Router,
    public printService: PrintService,
    public exportPdfService: ExportPdfService,
    public copyService: CopyService,
    public csvService: CsvService
  ) { }

  ngOnInit() {
    this.usuarioService.getUsuarios()
    .subscribe( res => {
      this.cargando = true;
      this.listaUsuarios = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.cargando = false;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  csvLista() {
    this.csvService.title = 'Lista de Usuarios';
    this.csvService.encabezado = ['id', 'Email', 'Google', 'Imagen', 'Nombre', 'Password', 'Role'  ];
    this.csvService.data = this.listaUsuarios;
    this.csvService.exportarDatos();
    this.csvService.exportar();
  }

  copiarLista() {
    this.copyService.title = 'Lista de Usuarios';
    this.copyService.encabezado = ['id', 'Email', 'Google', 'Imagen', 'Nombre', 'Password', 'Role'  ];
    this.copyService.data = this.listaUsuarios;
    this.copyService.exportarDatos();
    this.copyService.copiar();
  }

  exportarPdf() {
    this.exportPdfService.setEncabezado();
    this.exportPdfService.setTitle('Lista de Usuarios');
    this.exportPdfService.crearListaUsuarios(this.listaUsuarios);
    this.exportPdfService.guardar('Lista_de_usuarios.pdf');
    return;
  }

  imprimir() {
    this.printService.titulo = 'Lista de Usuarios';
    const encabezado = ['Imagen', 'Email', 'Nombre', 'Role', 'Google'];
    this.printService.crearListaUsuarios( encabezado, this.listaUsuarios );
    this.printService.imprimir();
  }

  crearNuevoUsuario() {
    sweetAlert('ATENCION', 'De momento no se permite la creación de usuarios', 'warning');
  }

  ver(usuario: Usuario) {
    this.router.navigate(['/usuario/ver/' + usuario._id]);
  }

  editar(usuario: Usuario) {
    this.router.navigate(['/usuario/editar/' + usuario._id]);
  }

  eliminar(usuario: Usuario) {
    this.usuarioService.deleteUsuario(usuario._id);
  }

}
