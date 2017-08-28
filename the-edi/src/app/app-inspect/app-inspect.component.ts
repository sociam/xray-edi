import { Component, OnInit } from '@angular/core';
import { SelectionTrackingService } from '../service/selection-tracking.service';
import { FullApp } from '../service/app-info-types.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { XrayAPIService } from '../service/xray-api.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-app-inspect',
  templateUrl: './app-inspect.component.html',
  styleUrls: ['./app-inspect.component.scss']
})
export class AppInspectComponent implements OnInit {

  public currentSelection: FullApp;
  public selectionMade: boolean = false;

  public allSelections: Map<string, FullApp> = new Map<string, FullApp>();
  public selectionValues: FullApp[];

  public test: string = '';

  private currentSubscription: Subscription;
  private selectionSubscription: Subscription;


  removeApp(id: string) {
    this.appTracker.removeApp(id);
  }
  constructor(private appTracker: SelectionTrackingService,
              private route: ActivatedRoute,
              private router: Router,
              private xrayAPI: XrayAPIService) {
                router.events.subscribe((event) => {
                  if (event instanceof NavigationStart) {
                    this.currentSubscription.unsubscribe();
                    this.selectionSubscription.unsubscribe();
                  }
                })
              }

  ngOnInit() {

    this.route.params.subscribe((param) => {
      if(param.app && param.app) {
        this.xrayAPI
        .fetchApps({fullInfo: true, limit:1, appID: param.app})
        .subscribe((app) => {
          if(app.length > 0 && app[0].app == param.app) {
            this.appTracker.setCurrentSelection(app[0]);
          }
          else {
            this.router.navigate(['404']);
          }
        })
      }
    })


    this.currentSubscription = this.appTracker.currentSelectionChanged.subscribe((data) => {
      this.currentSelection = this.appTracker.getCurrentSelection();
      this.selectionMade = true;
      this.test = JSON.stringify(this.currentSelection,null,'  ');
      this.router.navigate(['apps/' + this.currentSelection.app]);
    })

    this.selectionSubscription = this.appTracker.appSelectionsChanged.subscribe((data) => {
      this.allSelections = this.appTracker.getSelections();
      this.selectionValues = Array.from(this.allSelections.keys()).map(key=>this.allSelections.get(key));
    })
  }
}
