import { Component, OnInit } from '@angular/core';
import { XrayAPIService } from '../service/xray-api.service';
import { Subscription } from 'rxjs';
import { CompanyInfoService } from '../service/company-info.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { GenreStats } from '../service/app-info-types.service';
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

  public genreStats: GenreStats[] = [];
  constructor(private xrayAPI: XrayAPIService, private companyInfo: CompanyInfoService, private router: Router)  { }

  private hostFreq(hosts: string[]) {
    let freq = _.countBy(hosts);
    return _.sortBy(_.keys(freq).map((key) => {return {host: key, count:freq[key]}}), 'count').reverse();
  }
  
  ngOnInit() {

    
  }

}
