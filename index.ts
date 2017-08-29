import { EasyTabsComponent } from './easy-tab/easy-tabs.component';
import { EasyTabComponent } from './easy-tab/easy-tab.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
      EasyTabComponent,
      EasyTabsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
  ],
  exports: [EasyTabComponent,EasyTabsComponent],
  providers: [],
})
export class EasyTabsModule { }


