import { Injectable, EventEmitter } from '@angular/core';
import { FullApp } from './app-info-types.service';

@Injectable()
export class SelectionTrackingService {

  private currentAppSelection: FullApp;
  private appSelections: Map<string, FullApp> // {[id: string]: FullApp };

  currentSelectionChanged: EventEmitter<FullApp> = new EventEmitter<FullApp>();
  appSelectionsChanged: EventEmitter<Map<string, FullApp>> = new EventEmitter<Map<string, FullApp>>();


  constructor() {
    this.appSelections = new Map<string, FullApp>();   
  }

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

  public setCurrentSelection(app: FullApp) {
    this.currentAppSelection = app;
    this.currentSelectionChanged.emit(this.currentAppSelection);
    
  }

  public getCurrentSelection(): FullApp {
    return this.currentAppSelection;
  }

}
