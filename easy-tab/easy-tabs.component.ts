import { TabsConf } from './tabs-conf';
import { EasyTabComponent } from './easy-tab.component';
import { Component, OnInit, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'easy-tabs',
    templateUrl: './easy-tabs.component.html',
    styleUrls: ['./easy-tabs.component.scss']
})
export class EasyTabsComponent implements AfterContentInit, AfterViewInit, OnInit {
    // holds reference to the currently active tab
    activeTab: EasyTabComponent;

    // default configuration
    @Input() conf: TabsConf = new TabsConf();

    // orientiation for the tab. Either vertical or horizontal. Default is horizontal tabs.
    @Input() vertical = false;

    // disable the submit depending upon the boolean criterion. by default submit button is shown
    @Input() disableSubmit = false;
    @Output() onSubmit = new EventEmitter<any>();

    // these onNext / onBack are called for all the tabs before switching tabs .
    @Output() onNext = new EventEmitter<any>();
    @Output() onBack = new EventEmitter<any>();

    // these onNext / onBack are called for all the tabs after switching tabs.
    @Output() onPostNext = new EventEmitter<any>();
    @Output() onPostBack = new EventEmitter<any>();


    // list of all the <tab> inside <tabs>
    @ContentChildren(EasyTabComponent) tabList: QueryList<EasyTabComponent>;

    // overrides that apply for all the tabs in the tablist.
    // By default they are undefined which means no override is active
    @Input() showBack;
    @Input() showNext;
    @Input() showSubmit;

    // default constructor
    constructor(private cd: ChangeDetectorRef) { }
    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    ngAfterContentInit() {

        this.assignTabId();
        this.initializeTab();
        this.tabList.changes.subscribe(() => {
            this.assignTabId();
            this.initializeTab();
            // this.selectTab(this.tabList.first);
            // this.cd.detectChanges();
        });



    }

    private initializeTab() {
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
        let defaultValues = new TabsConf();
        // for partial overrides
        for (let key in defaultValues) {
            if (typeof this.conf[key] === 'undefined') {
                this.conf[key] = defaultValues[key];
            }
        }
    }

    private assignTabId() {
        // console.log('tab id assigned called')
        this.tabList.forEach((tab, index) => {
            tab.id = index;
        });
    }

    private selectTab(tab: EasyTabComponent) {
        if (tab) {
            this.tabList.forEach((tab1) => {
                tab1.active = false;
            });
            tab.active = true;
            this.activeTab = tab;
            tab.detectChanges();
        } else {
            console.warn('Cannot switch to another tab');
        }
    }

    async gotoBack() {
        // event emitter defined for active tab
        this.activeTab.onBack.emit();

        // event emmitter defined for all the tabs
        this.onBack.emit();

        // if there are some things that need to be completed at any cost before switching tabs.
        // uses the concept of async/await.
        if (this.activeTab.preBackCallback) {
            await this.activeTab.preBackCallback();
        }

        // if (this.activeTab.valid) {
        this.selectTab(this.tabList.toArray()[this.tabList.toArray().indexOf(this.activeTab) - 1]);
        // }

        // event emitter defined for active tab
        this.activeTab.onPostBack.emit();

        // event emmitter defined for all the tabs
        this.onPostBack.emit();
    }

    async gotoNext() {
        // event emitter defined for active tab
        // debugger;
        this.activeTab.onNext.emit();

        // event emmitter defined for all the tabs
        this.onNext.emit();

        // if there are some things that need to be completed at any cost before switching tabs.
        // uses the concept of async/await.
        if (this.activeTab.preNextCallback) {
            await this.activeTab.preNextCallback();
        }

        if (this.activeTab.valid) {
            this.selectTab(this.tabList.toArray()[this.tabList.toArray().indexOf(this.activeTab) + 1]);
        }

        // event emitter defined for active tab
        this.activeTab.onPostNext.emit();

        // event emmitter defined for all the tabs
        this.onPostNext.emit();
    }

    get showNextButton(): boolean {
        /* there are 4 level of priority that determines whether the next button is shown or not.
            the priorities are listed on the basis of desending priority.
            1.  showNext defined on the <tab> [has absolute control. ie doesnt care whether it is last tab or not]
            2.  showNext defined on the <tabs> [ shown only when the tab is not the last tab]
            3.  showControls defined on the tabs.conf configuration file.
            4.  if nothing is defined, the algorithm calculates whether to show next button depending
                upon whether the tab is the last tab in the <tabs>.
                The next button is shown for all the tabs except the last tab,
                where submit button is shown instead of the next button
        */


        if (typeof this.activeTab.showNext !== 'undefined') {
            return this.activeTab.showNext;
        } else if (typeof this.showNext !== 'undefined') {
            return this.showNext && (this.activeTab !== this.tabList.last);
        } else if (this.conf.showControls) {
            return (this.activeTab !== this.tabList.last);
        }
    }
    get showBackButton(): boolean {

        /* there are 4 level of priority that determines whether the back button is shown or not.
            the priorities are listed on the basis of desending priority.
            1.  showBack defined on the <tab> [has absolute control. ie doesnt care whehter it is first tab or not]
            2.  showBack defined on the <tabs>
            3.  showControls defined on the tabs.conf configuration file.
            4.  if nothing is defined, the algorithm calculates whether to show back button depending
                upon whether the tab is the first tab in the <tabs>.
                The back button is shown for all the tabs except the first tab.
        */

        if (typeof this.activeTab.showBack !== 'undefined') {
            return this.activeTab.showBack;
        } else if (typeof this.showBack !== 'undefined') {
            return this.showBack;
        } else if (this.conf.showControls) {
            return (this.activeTab !== this.tabList.first);
        }
    }
    get showSubmitButton(): boolean {

        /* there are 3 level of priority that determines whether the submit button is shown or not.
            the priorities are listed on the basis of desending priority.
            1.  showSubmit defined on the <tabs> [has absolute control. ie doesnt care whehter it is last tab or not]
            2.  showControls defined on the tabs.conf configuration file.
            3.  if nothing is defined, the algorithm calculates whether to show submit button depending
                upon whether the tab is the last tab in the <tabs>.
                The submit button is shown only for the last tab.
        */

        if (typeof this.showSubmit !== 'undefined') {
            return this.showSubmit;
        } else if (this.conf.showControls) {
            return (this.activeTab == this.tabList.last);
        }
    }

    onSubmitFn() {
        this.onSubmit.emit();
    }


}
