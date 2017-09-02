import { Component, OnInit } from '@angular/core';
import { SelectionTrackingService } from '../service/selection-tracking.service';
import { Router, NavigationEnd } from '@angular/router';
import { FullApp } from '../service/app-info-types.service';

@Component({
  selector: 'app-display',
  templateUrl: './app-display.component.html',
  styleUrls: ['./app-display.component.scss']
})
export class AppDisplayComponent implements OnInit {
  
  public currentSelection: FullApp;
  public allSelections: Map<string, FullApp> = new Map<string, FullApp>();
  public selectionValues: FullApp[] = [];
  public boxShadows: string[] = [];

  removeApp(id: string) {
    this.appTracker.removeApp(id);
    this.appTracker.setHoverSelection([]);
  }

  constructor(private appTracker: SelectionTrackingService, private router: Router) {
    router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd ) {
        this.allSelections = this.appTracker.getSelections();
        this.selectionValues = Array.from(this.allSelections.keys()).map(key=>this.allSelections.get(key));
      }
    });
   }

  addHover(app: FullApp) {
    this.appTracker.setHoverSelection([app]);
  }

  removeHover() {
    this.appTracker.setHoverSelection([]);
  }

  ngOnInit() {
    this.selectionValues = Array.from(this.allSelections.keys()).map(key=>this.allSelections.get(key));

    this.appTracker.currentSelectionChanged.subscribe((data) => {
      this.currentSelection = this.appTracker.getCurrentSelection();
    });

    this.appTracker.appSelectionsChanged.subscribe((data) => {
      this.allSelections = this.appTracker.getSelections();
      this.selectionValues = Array.from(this.allSelections.keys()).map(key=>this.allSelections.get(key));
      this.boxShadows.fill('',this.selectionValues.length);
    });

    this.appTracker.hoverGroupChanged.subscribe((group) => {
      this.boxShadows = this.selectionValues.map((app) => group.get(app.app) != undefined ? 'highlighted' : '');
    })

  }

}
