import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TipoDocService {

  public tipo_doc = ['DNI', 'CI', 'LC', 'CUIL'];

  constructor() { }
}
