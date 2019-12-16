import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-constancia-tratamiento',
  templateUrl: './constancia-tratamiento.component.html',
  styleUrls: ['./constancia-tratamiento.component.css']
})
export class ConstanciaTratamientoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConstanciaTratamientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onNoClick() {
    console.log('onNoClick');
  }

}
