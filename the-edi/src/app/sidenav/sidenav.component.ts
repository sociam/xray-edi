import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FullApp } from '../service/app-info-types.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() appDetails: FullApp;
  public isAppSelected: boolean;
  
  @Output() selectionChange: EventEmitter<FullApp> = new EventEmitter<FullApp>();

  constructor() {
    this.isAppSelected = false;
   }

  appSelected(app: FullApp) {
    console.log('Event Caught in Side Nav')
    //console.log(app);
    this.isAppSelected = true;
    this.appDetails = app;
    this.selectionChange.emit(app);
    console.log('Side Nav Event Emitted.');
  }
  ngOnInit() {
  }

}
