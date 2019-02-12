import { NgModule } from '@angular/core';
import { NgRedux, NgReduxModule, } from '@angular-redux/store';

import configureStore from '../../../shared/store/configureStore';
import { AppState } from '../../../shared/store/store';

@NgModule({
  imports: [NgReduxModule]
})
export class StoreModule {
  constructor(
    public store: NgRedux<AppState>
  ) {
    store.provideStore(configureStore({}, 'renderer'));
  }
}
