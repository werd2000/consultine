import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-btn-volver',
  template:   `
  <button *ngIf="modelo === 'raised'" mat-raised-button color="primary" (click)="cancelar()" class="mr-2px w-50">
    <i class="material-icons">keyboard_arrow_left</i>
    Volver
  </button>
  <button *ngIf="modelo === 'mat-icon'" mat-icon-button matTooltip="Volver" (click)="cancelar()">
      <mat-icon aria-hidden="false" aria-label="Volver icon">
          <i class="material-icons">keyboard_arrow_left</i>
      </mat-icon>
  </button>
  `,
})
export class BtnVolverComponent {

  @Input() public modelo: any;

  constructor(
    private location: Location
  ) { }

  cancelar() {
    this.location.back();
  }

}
