import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SexoService {

  public sexo = ['VARON', 'MUJER'];

  constructor() { }
}
