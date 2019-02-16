import { NgRedux } from '@angular-redux/store';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { setRemindersEnabled } from '../../shared/store/settings/settings.action';
import { AppState } from '../../shared/store/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public store: NgRedux<AppState>) {
    store.dispatch(setRemindersEnabled(false));
    store.subscribe(() => console.log(store.getState()));
  }
}
