import { Component, Output, Input } from '@angular/core';
import { FullApp } from './service/app-info-types.service';

// services

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
