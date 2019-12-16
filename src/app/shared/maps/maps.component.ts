import { Component, OnInit, AfterViewChecked, AfterViewInit, AfterContentInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as Mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterContentInit, AfterViewInit, AfterViewChecked {

  @Input() lat: number;
  @Input() lng: number;
  mapbox = (Mapboxgl as typeof Mapboxgl);
  map: Mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  zoom = 12;

  constructor() {
    this.mapbox.accessToken = environment.mapbox.accessToken;
  }

  ngOnInit() {
    if (typeof(this.lat) === 'undefined') {
      this.lat = -27.3779;
    }
    if (typeof(this.lng) === 'undefined') {
      this.lng = -55.9256;
    }
  }

  ngAfterContentInit(): void {
    // this.buildMap();
  }

  ngAfterViewInit(): void {
    const tab = document.getElementById('mat-tab-label-0-1');
    tab.addEventListener('click', () => {
      console.log('lat: ' + this.lat, this.lng);
      this.buildMap();
    });
  }

  ngAfterViewChecked(): void {
      // this.buildMap();
  }

  buildMap() {
    try {
      this.map = new Mapboxgl.Map({
        container: 'mapamapbox',
        style: this.style,
        zoom: this.zoom,
        center: [this.lng, this.lat]
      });
    } catch (error) {
      console.error(error);
    }
    this.map.addControl(new Mapboxgl.NavigationControl());
    this.crearMarcador(this.lng, this.lat);
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
