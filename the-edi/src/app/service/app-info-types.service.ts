import { Injectable } from '@angular/core';

/**
 * AppStub represents the app information returned from the API when
 * the 'isFull' flag is set to false.
 * title - Title of the app the stub is for
 * appID - ID of the app that the stub is for
 */
export interface AppStub {
  title: string;
  appID: string;
}

/**
 * Genre Stats represents a record from the app genre stats table found
 * in the xray DB.
 * Category - the name of the category the statistic applies to
 * hostCount - the number of hosts found accross all apps in this genre
 * appCount - the number of apps found in this genre
 * genreAvg - the average number of hosts across apps in this genre.
 */
export interface GenreStats {
  category: string;
  hostCount: number;
  appCount: number;
  genreAvg: number;
}

/**
 * Company Type Stats represents a record from the company types coverage stats
 * table found in the XRay DB.
 */
export interface CompanyTypeStats {
  type: string;
  appCount: number;
  totalApps: number;
  typeFreq: number;
}

/**
 * Company Stats represents a record from the company coverage stats table
 * found in the xray db.
 * Company - the name of the company
 * appCount - the number of apps that contain a host that directs to this company
 * totalApps - the total number of apps that are analysed and available
 * companyFreq - the percentage of apps that contain a host associated with a company
 */
export interface CompanyStats {
  company: string;
  type: string;
  appCount: number;
  totalApps: number;
  companyFreq: number;
}

/**
 * Installs represents the range of install that an app may have.
 * The install data scraped from google proviedes a max and a min
 * amount
 * min - The minimum amount of installs that a specific app could have
 * max - The maximum amount of installs that a specific app could have
 */
export interface Installs {
  min: number;
  max: number;
}

/**
 * StoreInfo is all of the information that could be scraped from
 * an app's google playstore a page. This information is returned
 * from the xray API when the 'isFull' flag is set to true.
 */
export interface StoreInfo {
  title: string;
  summary: string;
  description: string;
  storeURL: string;
  price: string;
  free: boolean;
  rating: string;
  numReviews: number;
  genre: string;
  familyGenre:string;
  installs: Installs;
  developer: number;
  updated: string;
  androidVer: string;
  contentRating: string;
  screenshots: string[];
  video: string;
  recentChanges: string[];
  crawlDate: string;
  permissions: string[];

}

export interface Developer {
  emails: string[];
  name: string;
  storeSite: string;
  site: string;
}

export interface FullApp {
  id: string;
  app: string;
  store: string;
  region: string;
  ver: string;
  screenFlags: number;
  storeinfo: StoreInfo;
  icon: string;
  developer: Developer;
  hosts: string[];
  perms: string[];
  packages: string[];
}

export interface CompanyGenreCoverage {
  company: string;
  companyCount: number;
  genre: string;
  genreTotal: number;
  companyPct: number
}

@Injectable()
export class AppInfoTypesService {

  constructor() { }

}
