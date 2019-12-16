import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { PacienteService, PrintService, ExportPdfService, CopyService, CsvService } from 'src/app/services/service.index';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
})
export class PacientesComponent implements OnInit {

  displayedColumns: string[] = [
    'imagen',
    'apellido',
    'nombre',
    'nro_doc',
    'fecha_nac',
    'estado',
    'acciones'
  ];
  dataSource: MatTableDataSource<any>;
  cargando = true;
  listaPacientes;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public router: Router,
    public pacienteService: PacienteService,
    public printService: PrintService,
    public exportPdfService: ExportPdfService,
    public copyService: CopyService,
    public csvService: CsvService
  ) { }

  ngOnInit() {
    this.pacienteService.getPacientes()
    .subscribe( res => {
      this.cargando = true;
      this.listaPacientes = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.cargando = false;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  crearNuevoPaciente() {
    this.router.navigate(['/paciente/nuevo']);
  }

  imprimir() {
    this.printService.titulo = 'Lista de Pacientes';
    const encabezado = ['Imagen', 'Apellido', 'Nombre', 'Nro. Doc.', 'Fecha nac.'];
    this.printService.crearListaPacientes( encabezado, this.listaPacientes );
    this.printService.imprimir();
  }

  exportarPdf() {
    this.exportPdfService.setEncabezado();
    this.exportPdfService.setTitle('Lista de pacientes');
    this.exportPdfService.crearLista(this.listaPacientes);
    this.exportPdfService.guardar('Lista_de_pacientes.pdf');
    return;
  }

  copiarLista() {
    this.copyService.title = 'Lista de Pacientes';
    this.copyService.encabezado = ['Imagen', 'Apellido', 'Nombre', 'Nro. Doc.', 'Fecha nac.'];
    this.copyService.data = this.listaPacientes;
    this.copyService.exportarDatos();
    this.copyService.copiar();
  }

  csvLista() {
    this.csvService.title = 'Lista de Pacientes';
    this.csvService.encabezado = ['Imagen', 'Apellido', 'Fecha nac.', 'Nacionalidad', 'Nombre', 'Nro. Doc.',  'Sexo', 'Doc.'];
    this.csvService.data = this.listaPacientes;
    this.csvService.exportarDatos();
    this.csvService.exportar();
  }

  editar(paciente) {
    this.router.navigate(['/paciente/editar/' + paciente._id]);
  }

  ver(paciente) {
    this.router.navigate(['/paciente/ver/' + paciente._id]);
  }

  eliminar(paciente) {
    this.pacienteService.deletePaciente(paciente);
  }

  verTurnos(paciente) {
    this.router.navigate(['/turnos/paciente/' + paciente._id]);
  }

}
