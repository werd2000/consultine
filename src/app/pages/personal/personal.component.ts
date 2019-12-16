import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { PrintService, ExportPdfService, CopyService, CsvService, PersonalService } from 'src/app/services/service.index';
import { EmpleadoProfile } from 'src/app/models/empleado.model';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  // styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  public cargando = true;
  displayedColumns: string[] = [
    'imagen',
    'apellido',
    'nombre',
    'nro_doc',
    'fecha_nac',
    'area',
    'acciones'
  ];
  dataSource: MatTableDataSource<any>;
  listaPersonal;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public router: Router,
    public personalService: PersonalService,
    public printService: PrintService,
    public exportPdfService: ExportPdfService,
    public copyService: CopyService,
    public csvService: CsvService
  ) { }

  ngOnInit() {
    this.personalService.getPersonal()
    .subscribe( res => {
      this.cargando = true;
      this.listaPersonal = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.cargando = false;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // TODO: Arreglar el encabezado para que corresponda con los datos
  csvLista() {
    this.csvService.title = 'Lista del Personal';
    this.csvService.encabezado = [
      'id',
      'Actualizado el',
      'Actualizado por',
      'Apellido',
      'Contactos',
      'Domicilio',
      'Familiares',
      'Profesion',
      'Fecha Alta',
      'Fecha Baja',
      'Fecha nac.',
      'Img',
      'Nacionalidad',
      'Nombre',
      'Nro. Doc.',
      'Observaciones',
      'S. Social',
      'Sexo',
      'Tipo Doc.'
    ];
    this.csvService.data = this.listaPersonal;
    this.csvService.exportarDatos();
    this.csvService.exportar();
  }

  copiarLista() {
    this.copyService.title = 'Lista de Personal';
    this.copyService.encabezado = ['Imagen', 'Apellido', 'Nombre', 'Nro. Doc.', 'Fecha nac.'];
    this.copyService.data = this.listaPersonal;
    this.copyService.exportarDatos();
    this.copyService.copiar();
  }

  exportarPdf() {
    this.exportPdfService.setEncabezado();
    this.exportPdfService.setTitle('Lista de personal');
    this.exportPdfService.crearLista(this.listaPersonal);
    this.exportPdfService.guardar('Lista_de_personal.pdf');
    return;
  }

  imprimir() {
    this.printService.titulo = 'Lista de Personal';
    const encabezado = ['Imagen', 'Apellido', 'Nombre', 'Nro. Doc.', 'Fecha nac.'];
    this.printService.crearListaPersonal( encabezado, this.listaPersonal );
    this.printService.imprimir();
  }

  crearNuevoEmpleado() {
    this.router.navigate(['/empleado/nuevo']);
  }

  ver(empleado: EmpleadoProfile) {
    this.router.navigate(['/empleado/ver/' + empleado._id]);
  }

  editar(empleado: EmpleadoProfile) {
    this.router.navigate(['/empleado/editar/' + empleado._id]);
  }

  eliminar(empleado: EmpleadoProfile) {
    this.personalService.deletePersonal(empleado);
  }

}
