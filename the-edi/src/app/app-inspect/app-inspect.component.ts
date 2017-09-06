import { Component, OnInit } from '@angular/core';
import { SelectionTrackingService } from '../service/selection-tracking.service';
import { FullApp } from '../service/app-info-types.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { XrayAPIService } from '../service/xray-api.service';
import { Subscription } from 'rxjs/Subscription';
import { CompanyInfoService, CompanyInfo } from '../service/company-info.service';

enum dangerZone {
  dangerous,
  thirdparty,
  normal
}

export class Perms {
  level: dangerZone
  description: string
  name: string
}
@Component({
  selector: 'app-app-inspect',
  templateUrl: './app-inspect.component.html',
  styleUrls: ['./app-inspect.component.scss']
})
export class AppInspectComponent implements OnInit {

  public currentSelection: FullApp;
  public selectionMade: boolean = false;

  public companyHosts: Map<string, string[]> = new Map<string, string[]>();

  public allSelections: Map<string, FullApp> = new Map<string, FullApp>();
  public selectionValues: FullApp[];
  public altApps: FullApp[] = [];
  public test: string = '';
  public currentAltTitle: string = '';

  private currentSubscription: Subscription;
  private selectionSubscription: Subscription;


  public downloads: string = '0';

  removeApp(id: string) {
    this.appTracker.removeApp(id);
  }
  constructor(private appTracker: SelectionTrackingService,
    private route: ActivatedRoute,
    private router: Router,
    private xrayAPI: XrayAPIService,
    private companyLookup: CompanyInfoService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart && event.url.split('/')[1] != 'apps') {
        this.currentSubscription.unsubscribe();
        this.selectionSubscription.unsubscribe();
      }
    })
  }

  setCompare(app: FullApp) {
    this.currentAltTitle = app.storeinfo.title;
    this.appTracker.setCompareSelection(app);
  }

  ngOnInit() {
    this.route.params.subscribe((param) => {

      if (param.app && param.app) {
        this.xrayAPI.fetchApps({ fullInfo: true, limit: 10, appID: param.app }).subscribe((app) => {
          app = app.filter(element => element.app == param.app);
          if (app.length > 0 && app[0].app == param.app) {
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
      this.test = JSON.stringify(this.currentSelection, null, '  ');
      this.downloads = this.currentSelection.storeinfo.installs.max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      this.router.navigate(['apps/' + this.currentSelection.app]);


      let companiesToHosts = this.loadCompanyHosts(this.currentSelection);

      console.log( companiesToHosts);
      let companyToHosts = companiesToHosts.reduce((acc, x) => {
        this.companyHosts[x.company] = this.companyHosts[x.company] ? this.companyHosts[x.company].concat([x.host])  || {} : [x.host];
        return this.companyHosts;
      }, {});

      console.log(this.companyHosts);

    });

    this.selectionSubscription = this.appTracker.appSelectionsChanged.subscribe((data) => {
      this.allSelections = this.appTracker.getSelections();
      this.selectionValues = Array.from(this.allSelections.keys()).map(key => this.allSelections.get(key));
    });



  }

  private loadCompanyHosts(app: FullApp) {
    return app.hosts.map((host) => {
      let mapping = this.companyLookup.getCompanyFromDomain(host).map((company: CompanyInfo) => company.id);
      let pair = { company: '', app: '' }

      if (mapping.length == 0) {
        return { company: 'Unknown', host: host }
      }
      return { company: mapping[0], host: host };
    }); //.reduce((a,b) => a.concat(b),[]);

  }

}
