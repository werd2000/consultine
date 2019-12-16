import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PacienteService } from './paciente/paciente.service';
import { PrintService } from './print/print.service';
import { ExportPdfService } from './exportPdf/export-pdf.service';
import { EmpresaService } from './empresa/empresa.service';
import { CopyService } from './copy/copy.service';
import { CsvService } from './csv/csv.service';
import { TipoDocService } from './tipoDoc/tipo-doc.service';
import { SexoService } from './sexo/sexo.service';
import { FechaEdadService } from './fechaEdad/fecha-edad.service';
import { UsuarioService } from './usuario/usuario.service';
import { PrintUsuarioService } from './print/print.usuario.service';
import { DomicilioService } from './domicilio/domicilio.service';
import { TipoContactoService } from './tipoContacto/tipo-contacto.service';
import { FamiliaService } from './familia/familia.service';
import { SsocialService } from './ssocial/ssocial.service';
import { PersonalService } from './personal/personal.service';
import { AreasService } from './area/area.service';
import { ProfesionService } from './profesion/profesion.service';
import { PrintPersonalService } from './print/print.personal.service';
import { PrintPacienteService } from './print/print.paciente.service';
import { PrintAreaService } from './print/print.area.service';
import { TurnosService } from './turnos/turnos.service';
import { ModalTurnoService } from './turnos/modalTurno.service';
import { MapService } from './map/map.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    PacienteService,
    PrintService,
    ExportPdfService,
    EmpresaService,
    CopyService,
    CsvService,
    TipoDocService,
    SexoService,
    FechaEdadService,
    UsuarioService,
    PrintUsuarioService,
    DomicilioService,
    TipoContactoService,
    FamiliaService,
    SsocialService,
    PersonalService,
    AreasService,
    ProfesionService,
    PrintPersonalService,
    PrintPacienteService,
    PrintAreaService,
    TurnosService,
    ModalTurnoService,
    MapService
  ]
})
export class ServiceModule { }
