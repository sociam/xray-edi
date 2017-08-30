import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import 'rxjs/operator/toPromise';
export interface CompanyInfo {
  ch: string,
  id: string,
  company_old: string,
  company: string,
  crunchbase_url: string,
  domains: string,
  founded: string,
  acquired: string,
  type: string,
  typetag: string,
  jurisdiction: string,
  jurisdiction_code: string,
  parent: string,
  capital: string,
  equity: string,
  size: string,
  data: string,
  description: string
  }

@Injectable()
export class CompanyInfoService {

  public companyInfo: Map<string, CompanyInfo> = new Map<string, CompanyInfo>();
  public companyInfoParsed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private httpClient: HttpClient) {
    this.companyInfo = new Map<string, CompanyInfo>();
    this.parseCompanyInfo()
  }
  
  parseCompanyInfo() {
    return this.httpClient.get<Map<string, CompanyInfo>>('../../assets/data/company_details.json')
    .subscribe(response => {
      this.companyInfo = response;
      this.companyInfoParsed.emit(true);
    });
  }

  extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

  extractRootDomain(url) {
    var domain = this.extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    return domain;
}

  getCompanyFromDomain(domain: string) {
    domain = this.extractRootDomain(domain);
    return Object.keys(this.companyInfo).map((key) => this.companyInfo[key]).filter((company) => {
      return company.domains.filter((d) => d == domain).length != 0;
    });
  }
   
}
