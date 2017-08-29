import { TabsConf } from './tabs-conf';
import { EasyTabComponent } from './easy-tab.component';
import { Component, OnInit, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'easy-tabs',
    templateUrl: './easy-tabs.component.html',
    styleUrls: ['./easy-tabs.component.scss']
})
export class EasyTabsComponent implements AfterContentInit, AfterViewInit, OnInit {

    activeTab: EasyTabComponent;
    @Input() conf: TabsConf;

    // orientiation for the tab. Either vertical or horizontal. Default is horizontal tabs.
    @Input() vertical = false;

    // disable the submit depending upon the boolean criterion
    @Input() disableSubmit = false;
    @Output() onSubmit = new EventEmitter<any>();

    // these onNext / onBack are called for all the tabs .
    @Output() onNext = new EventEmitter<any>();
    @Output() onBack = new EventEmitter<any>();

    // list of all the <tab> inside <tabs>
    @ContentChildren(EasyTabComponent) tabList: QueryList<EasyTabComponent>;

    // overrides that apply for all the tabs in the tablist.
    @Input() showBack;
    @Input() showNext;
    @Input() showSubmit;

    // default constructor
    constructor(private cd: ChangeDetectorRef) { }
    ngAfterViewInit() {
        this.cd.detectChanges();
    }
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabList.filter((tab) => tab.active);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabList.first);
        }
    }

    ngOnInit() {
        if (!this.conf) {
            this.conf = new TabsConf();
        }

    }

    selectTab(tab: EasyTabComponent) {
        if (tab) {
            this.tabList.forEach((tab) => {
                tab.active = false;
            });
            tab.active = true;
            this.activeTab = tab;

        } else {
            console.warn('Cannot switch to another tab')
        }
    }

    gotoBack() {
        // event emitter defined for active tab
        this.activeTab.onBack.emit();

        // event emmitter defined for all the tabs
        this.onBack.emit();

        if (this.activeTab.valid) {
            this.selectTab(this.tabList.toArray()[this.tabList.toArray().indexOf(this.activeTab) - 1]);
        }
    }

    gotoNext() {
        // event emitter defined for active tab
        this.activeTab.onNext.emit();

        // event emmitter defined for all the tabs
        this.onNext.emit();

        if (this.activeTab.valid) {
            this.selectTab(this.tabList.toArray()[this.tabList.toArray().indexOf(this.activeTab) + 1]);
        }
    }

    get showNextButton(): boolean {
        /* there are 4 level of priority that determines whether the next button is shown or not. 
            the priorities are listed on the basis of desending priority.
            1.  showNext defined on the <tab>
            2.  showNext defined on the <tabs>
            3.  showControls defined on the tabs.conf configuration file.
            4.  if nothing is defined, the algorithm calculates whether to show next button depending
                upon whether the tab is the last tab in the <tabs>.
                The next button is shown for all the tabs except the last tab,
                where submit button is shown instead of the next button
        */


        if (this.activeTab.showNext != "undefined") {
            return this.activeTab.showNext;
        } else if (typeof this.showNext != "undefined") {
            return this.showNext;
        } else if (typeof this.conf.showControls != "undefined") {
            return this.conf.showControls;
        } else {
            return (this.activeTab != this.tabList.last);
        }
    }
    get showBackButton(): boolean {

        /* there are 4 level of priority that determines whether the back button is shown or not. 
            the priorities are listed on the basis of desending priority.
            1.  showBack defined on the <tab>
            2.  showBack defined on the <tabs>
            3.  showControls defined on the tabs.conf configuration file.
            4.  if nothing is defined, the algorithm calculates whether to show back button depending
                upon whether the tab is the first tab in the <tabs>.
                The back button is shown for all the tabs except the first tab.
        */
        if (this.activeTab.showBack != "undefined") {
            return this.activeTab.showBack;
        } else if (typeof this.showBack != "undefined") {
            return this.showBack;
        } else if (typeof this.conf.showControls != "undefined") {
            return this.conf.showControls;
        } else {
            return (this.activeTab != this.tabList.first);
        }
    }
    get showSubmitButton(): boolean {

        /* there are 3 level of priority that determines whether the submit button is shown or not.
            the priorities are listed on the basis of desending priority.
            1.  showSubmit defined on the <tabs>
            2.  showControls defined on the tabs.conf configuration file.
            4.  if nothing is defined, the algorithm calculates whether to show submit button depending
                upon whether the tab is the last tab in the <tabs>.
                The submit button is shown only for the last tab.
        */

        if (typeof this.showSubmit != "undefined") {
            return this.showSubmit;
        } else if (typeof this.conf.showControls != "undefined") {
            return this.conf.showControls;
        } else {
            return (this.activeTab == this.tabList.last);
        }
    }

    onSubmitFn() {
        this.onSubmit.emit();
    }


}
