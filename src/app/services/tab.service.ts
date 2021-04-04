import {Tab} from '@helpers/tab';
import {Injectable} from "@angular/core";

@Injectable()
export class TabService {

    private _tabs: Tab[] = [];
    public active: Tab = null;

    get tabs(): Tab[] {
        return this._tabs;
    }

    getTab(id: number): Tab {
        return this._tabs.filter((tab: Tab) => {
            return tab.id === id;
        })[0];
    }

    addTab(tab: Tab): void {
        this._tabs.push(tab);
    }

    removeTab(tab: Tab): void {
        const index = this._tabs.indexOf(tab);

        if (index !== -1) {
            this._tabs.splice(index, 1);
        }
    }

}
