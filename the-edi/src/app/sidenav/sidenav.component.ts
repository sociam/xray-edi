import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FullApp } from '../service/app-info-types.service';
import { SelectionTrackingService } from '../service/selection-tracking.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  public isAppSelected: boolean;
  
  @Output() selectionChange: EventEmitter<FullApp>;
  @Input() appDetails: FullApp;

  constructor(private appTracker: SelectionTrackingService) {
    this.isAppSelected = false;
    this.selectionChange = new EventEmitter<FullApp>();
   }

  appSelected(app: FullApp) {
    //console.log(app);
    this.isAppSelected = true;
    this.appDetails = app;
    this.selectionChange.emit(app);
  }
  ngOnInit() {
  }

}
