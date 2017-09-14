import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slidepanel',
  templateUrl: './slidepanel.component.html',
  styleUrls: ['./slidepanel.component.scss']
})
export class SlidepanelComponent implements OnInit {

  public panels : string[] = [
   '',
   'hidden-panel' 
  ];

  constructor() { }

  ngOnInit() {
  }

}
