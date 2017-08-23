import { Component, Output } from '@angular/core';
import { FullApp } from './service/app-info-types.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EDI';

  public appData: FullApp;
  
  constructor() {}
  
  handleSelectionEmit(appData) {
    this.appData = appData;
    console.log('Root Component Triggered.');
  }
}
