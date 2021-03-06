import { Injectable, EventEmitter } from '@angular/core';
import { FullApp } from './app-info-types.service';

@Injectable()
export class SelectionTrackingService {

  private currentAppSelection: FullApp;
  private appSelections: Map<string, FullApp> // {[id: string]: FullApp };

  private compareSelection: FullApp;
  private compareGroup: Map<string, FullApp>;
 
  public currentSelectionChanged: EventEmitter<FullApp> = new EventEmitter<FullApp>();
  public appSelectionsChanged: EventEmitter<Map<string, FullApp>> = new EventEmitter<Map<string, FullApp>>();

  public compareSelectionChanged: EventEmitter<FullApp> = new EventEmitter<FullApp>();
  public compareGroupChanged: EventEmitter<Map<string, FullApp>> = new EventEmitter<Map<string, FullApp>>();

  public hoverSelectionChanged: EventEmitter<Array<FullApp>> = new EventEmitter<Array<FullApp>>();
  public hoverGroupChanged: EventEmitter<Map<string, FullApp>> = new EventEmitter<Map<string, FullApp>>();
   
  private hoverSelection: Array<FullApp>;
  private hoverGroup: Map<string, FullApp>;

  

  constructor() {
    this.appSelections = new Map<string, FullApp>();
    this.compareGroup = new Map<string, FullApp>();   
    this.hoverGroup = new Map<string, FullApp>();
    this.hoverSelection = [];
  }

  /**
   *  Collection of Selections
   */
  public addApp(app: FullApp) {
    this.appSelections.set(app.app, app);
    this.appSelectionsChanged.emit(this.appSelections);
  }

  public removeApp(id: string) {
    this.appSelections.delete(id);
    this.appSelectionsChanged.emit(this.appSelections);
  }

  public getApp(id: string): FullApp {
    return this.appSelections.get(id);
  }

  public getSelections(): Map<string, FullApp> {
    return this.appSelections;
  }

  /**
   *  Current Single App Selection
   */
  public setCurrentSelection(app: FullApp) {
    this.currentAppSelection = app;
    this.currentSelectionChanged.emit(this.currentAppSelection);
  }

  public getCurrentSelection(): FullApp {
    return this.currentAppSelection;
  }

  /**
   *  Hover Selection/s
   */
  public getHoverSelection(): Array<FullApp> {
    return this.hoverSelection;
  }

  public setHoverSelection(app: Array<FullApp>): void {
    this.hoverSelection = app;
    this.hoverSelectionChanged.emit(app);
  }

  public getHoverGroup(): Map<string, FullApp> {
    return this.hoverGroup;
  }

  public addHover(app: FullApp): void {
    this.hoverGroup.set(app.app, app);
    this.hoverGroupChanged.emit(this.hoverGroup);
  }

  public setHoverGroup(group: Map<string, FullApp>): void {
    this.hoverGroup = group;
    this.hoverGroupChanged.emit(group);
  }

  /**
   *  Compare Selection/s
   */
  public getCompareSelection(): FullApp {
    return this.compareSelection;
  }

  public setCompareSelection(app: FullApp): void {
    this.compareSelection = app;
    this.compareSelectionChanged.emit(app);
  }

  public getCompareGroup(): Map<string, FullApp> {
    return this.compareGroup;
  }

  public setCompareGroup(group: Map<string, FullApp>): void {
    this.compareGroup = group;
    this.compareGroupChanged.emit(group);
  }

  public addCompareGroup(app: FullApp): void {
    this.compareGroup.set(app.app, app);
    this.compareGroupChanged.emit(this.compareGroup);
  }

  public removeCompareGroup(id: string) {
    this.compareGroup.delete(id);
    this.compareGroupChanged.emit(this.compareGroup);
  }
 

}
