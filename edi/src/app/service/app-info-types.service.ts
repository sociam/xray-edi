import { Injectable } from '@angular/core';

export interface AppStub {
  title: string;
  appID: string;
}

export interface Installs {
  min: number;
  max: number;
}

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

@Injectable()
export class AppInfoTypesService {

  constructor() { }

}
