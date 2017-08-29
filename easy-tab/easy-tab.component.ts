import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';
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
  // Tab input with default values
  @Input() valid = true;
  @Input('title') title: string="Tab Title";
  @Input() disableNext = false;
  @Input() disableBack = false;
  @Input() showBack;
  @Input() showNext;

  // output
  // these event emitters are called when the user presses next/back button on the active tab. it is not 
  // called for all the tabs, only active tabs.
  @Output() onNext = new EventEmitter<any>();
  @Output() onBack = new EventEmitter<any>();

}