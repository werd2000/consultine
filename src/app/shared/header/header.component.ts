import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  @Output() toggleMenu: EventEmitter<string>;
  visible = 'hidden';
  title = 'Consulta';

  constructor() {
    this.toggleMenu = new EventEmitter();
  }

  ngOnInit() {
  }

  toggleSidebar() {
    if (this.visible === 'visible') {
      this.visible = 'hidden';
    } else {
      this.visible = 'visible';
    }
    this.toggleMenu.emit(this.visible);
    // console.log(this.toggleMenu);
  }

}
