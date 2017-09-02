import { Component, OnInit } from '@angular/core';
import { XrayAPIService } from '../service/xray-api.service';
import { Subscription } from 'rxjs';
import { CompanyInfoService } from '../service/company-info.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-observatory',
  templateUrl: './observatory.component.html',
  styleUrls: ['./observatory.component.scss']
})
export class ObservatoryComponent implements OnInit {

  private appQuery : Subscription
  public hosts: string[] = [];
  public knownHosts: string[] = [];
  public hostCounts: Array<{host: string, count:number}> = [];
  public knownCounts: Array<{host: string, count:number}> = [];
  public loadingComplete: boolean = false;

  constructor(private xrayAPI: XrayAPIService, private companyInfo: CompanyInfoService)  { }

  private hostFreq(hosts: string[]) {
    let freq = _.countBy(hosts);
    return _.sortBy(_.keys(freq).map((key) => {return {host: key, count:freq[key]}}), 'count').reverse();
  }
  
  ngOnInit() {
    this.companyInfo.parseCompanyInfo()
    this.companyInfo.companyInfoParsed.subscribe(data => {
    this.appQuery = this.xrayAPI.fetchApps({fullInfo: true, onlyAnalyzed: true, limit: 10000})
    .subscribe((data) => { 
      /* Getting a List of Hosts */
      this.hosts = data.map(app => app.hosts).reduce((a,b) => a.concat(b), []).map(host =>  {
        let company = this.companyInfo.getCompanyFromDomain(host);
        if(company.length) {
          return company[0].id;
        }
        return 'Unknown';
      });
      /* Freq Counts of the hosts. */
      
      this.hostCounts = this.hostFreq(this.hosts);
      this.knownCounts = this.hostFreq(this.hosts.filter(host => host != 'Uknown'));
      this.loadingComplete = true;
    });
    })
    
  }

}
