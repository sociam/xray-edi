import { Component, OnInit } from '@angular/core';
import { SelectionTrackingService } from '../service/selection-tracking.service';
import { FullApp } from '../service/app-info-types.service';

@Component({
  selector: 'app-display',
  templateUrl: './app-display.component.html',
  styleUrls: ['./app-display.component.scss']
})
export class AppDisplayComponent implements OnInit {
  
  public currentSelection: FullApp;
  public allSelections: Map<string, FullApp> = new Map<string, FullApp>();
  public selectionValues: FullApp[];

  constructor(private appTracker: SelectionTrackingService) { }

  ngOnInit() {
    this.appTracker.currentSelectionChanged.subscribe((data) => {
      this.currentSelection = this.appTracker.getCurrentSelection();
    })

    this.appTracker.appSelectionsChanged.subscribe((data) => {
      this.allSelections = this.appTracker.getSelections();
      this.selectionValues = Array.from(this.allSelections.keys()).map(key=>this.allSelections.get(key));
      console.log(this.selectionValues);
    })
  }

}
