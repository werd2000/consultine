import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as Mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  mapbox = (Mapboxgl as typeof Mapboxgl);
  map: Mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  // Coordenadas de la localización donde queremos centrar el mapa
  lat = -27.37;
  lng = -55.91;
  zoom = 15;

  constructor() {
    // Asignamos el token desde las variables de entorno
    this.mapbox.accessToken = environment.mapbox.accessToken;
  }

  buildMap() {
    this.map = new Mapboxgl.Map({
      container: 'mapamapbox',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new Mapboxgl.NavigationControl());
  }

  crearMarcador(lng: number, lat: number) {
    const marker = new Mapboxgl.Marker({
        draggable: true
      });
    marker.setLngLat([lng, lat]);
    marker.addTo(this.map);

    marker.on('drag', () => {
      console.log(marker.getLngLat());
    });
  }
}
