import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Area } from 'src/app/models/area.model';
import { AreasService, ExportPdfService, CopyService, CsvService, PrintService } from 'src/app/services/service.index';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'area',
    'observaciones',
    'acciones'
  ];
  dataSource: MatTableDataSource<any>;
  suscriptor: Subscription;
  cargando: boolean;
  totalAreas: number;
  areas: Area[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public areaService: AreasService,
    public router: Router,
    public exportPdfService: ExportPdfService,
    public copyService: CopyService,
    public csvService: CsvService,
    public printService: PrintService
  ) { }

  ngOnInit() {
    this.suscriptor = this.areaService.getAreas()
      .subscribe( resp => {
        this.cargando = true;
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalAreas = resp.length;
        this.areas = resp;
        this.cargando = false;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.suscriptor.unsubscribe();
  }

  crearNuevaArea() {
    this.router.navigate(['/area/nuevo']);
  }

  eliminar( area: Area ) {
    this.areaService.deleteArea(area);
  }

  ver(area: Area) {
    this.router.navigate(['/area/ver/' + area._id ])
  }

  editar(area: Area) {
    this.router.navigate(['/area/editar/' + area._id ])    
  }

  csvLista() {
    this.csvService.title = 'Lista de Áreas';
    this.csvService.encabezado = ['Id', 'Area', 'Observaciones'];
    this.csvService.data = this.areas;
    this.csvService.exportarDatos();
    this.csvService.exportar();
  }

  copiarLista() {
    this.copyService.title = 'Lista de Áreas';
    this.copyService.encabezado = ['Área', 'Observaciones'];
    this.copyService.data = this.areas;
    this.copyService.exportarDatos();
    this.copyService.copiar();
  }

  exportarPdf() {
    this.exportPdfService.setEncabezado();
    this.exportPdfService.setTitle('Lista de areas');
    this.exportPdfService.crearListaAreas(this.areas);
    this.exportPdfService.guardar('Lista_de_areas.pdf');
    return;
  }

  imprimir() {
    this.printService.titulo = 'Lista de Áreas';
    const encabezado = ['Área', 'Observaciones'];
    this.printService.crearListaAreas( encabezado, this.areas );
    this.printService.imprimir();
  }

}
