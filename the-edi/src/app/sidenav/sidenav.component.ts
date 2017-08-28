import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FullApp } from '../service/app-info-types.service';
import { SelectionTrackingService } from '../service/selection-tracking.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() updateCurrent: boolean = true;
  @Input() updateList: boolean = false;

  constructor(private appTracker: SelectionTrackingService) {
   }

  appSelected(app: FullApp) {
    //console.log(app);

    if(this.updateCurrent) {
      this.appTracker.setCurrentSelection(app);
    }
    if(this.updateList) {
      this.appTracker.addApp(app);
    }
  }
  ngOnInit() {
  }

}
