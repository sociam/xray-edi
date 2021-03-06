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
  public altApps: FullApp[] = [];
  public test: string = '';
  public currentAltTitle: string = '';
  public compareSelection: FullApp;

  private fetchSubscription: Subscription = new Subscription();
  private currentSubscription: Subscription;
  private selectionSubscription: Subscription;
  public downloads: string = '0';

  removeApp(id: string) {
    this.appTracker.removeApp(id);
  }
  constructor(private appTracker: SelectionTrackingService,
              private route: ActivatedRoute,
              private router: Router,
              private xrayAPI: XrayAPIService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart && event.url.split('/')[1] != 'apps') {
        this.currentSubscription.unsubscribe();
        this.selectionSubscription.unsubscribe();
      }
    })
  }

  setCompare(app: FullApp) {
    this.currentAltTitle = app.storeinfo.title;
    this.compareSelection = app;
    this.appTracker.setCompareSelection(app);
  }
  selectApp(app: FullApp) {
    this.compareSelection = this.currentSelection;
    this.appTracker.setCompareSelection(this.compareSelection);
    this.currentSelection = app;
    this.appTracker.setCurrentSelection(app);
  }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      if(param.app) {
        if(!this.fetchSubscription.closed) {
          this.fetchSubscription.unsubscribe();
        }
        this.fetchSubscription = this.xrayAPI.fetchApps({fullInfo: true, limit:10, appID: param.app}).subscribe((app) => {
          app = app.filter(element => element.app == param.app);
          if(app.length > 0 && app[0].app == param.app) {
            if(!this.currentSubscription.closed) {}
            this.appTracker.setCurrentSelection(app[0]);
          }
          else {
            this.router.navigate(['404']);
          }
        });

        this.xrayAPI.fetchAlts(param.app).subscribe((alts) => {
          this.altApps = [];
          alts.map((alt) => alt.then((app) => this.altApps.push(app)));
        });
      }
    });

    this.currentSubscription = this.appTracker.currentSelectionChanged.subscribe((data) => {
      this.currentSelection = this.appTracker.getCurrentSelection();
      this.selectionMade = true;
      this.test = JSON.stringify(this.currentSelection,null,'  ');
      this.downloads = this.currentSelection.storeinfo.installs.max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      this.router.navigate(['apps/' + this.currentSelection.app]);
    });

    this.selectionSubscription = this.appTracker.appSelectionsChanged.subscribe((data) => {
      this.allSelections = this.appTracker.getSelections();
      this.selectionValues = Array.from(this.allSelections.keys()).map(key=>this.allSelections.get(key));
    });
  }
}
