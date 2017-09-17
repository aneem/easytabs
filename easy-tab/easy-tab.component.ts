import { Component, Input, OnChanges, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'easy-tab',

  template: `<div [hidden]="!active" class="p-1 tab-pane">
   <ng-content></ng-content>
   </div> `
  ,
  styleUrls: ['./easy-tabs.component.scss']
})
export class EasyTabComponent {

  // when a tab is created, it is by default not the active tab
  active = false;
  
  // unique identifier for the tab. determines the position of the tab
  id;

  // Tab input with default values
  // used to identify whether the next button should navigate to next tab
  @Input() valid = true;
  @Input('title') title = 'Tab Title';

  // tab level next/back button disablement
  @Input() disableNext = false;
  @Input() disableBack = false;

  // tab level overrides
  @Input() showBack;
  @Input() showNext;


  // these event emitters are called when the user presses next/back button on the active tab.
  // it is not called for all the tabs, only active tabs.

  // event emmitters. these dont wait for the function to get executed before switching tabs
  // pre conditions aka called before changing tabs;
  @Output() onNext = new EventEmitter<any>();
  @Output() onBack = new EventEmitter<any>();

  // post conditions aka called after changing tabs;

  @Output() onPostNext = new EventEmitter<any>();
  @Output() onPostBack = new EventEmitter<any>();

  // callback to be called in case of async calls
  @Input() preNextCallback;
  @Input() preBackCallback;

  constructor(private cd: ChangeDetectorRef) { }

  // needs to be called when the component property is modified from outside.
  // Here, the active property is modified by easy tabs
  detectChanges() {
    this.cd.detectChanges();
  }
}
