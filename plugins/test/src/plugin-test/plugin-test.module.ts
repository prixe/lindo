import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginTestConponent } from './plugin-test.conponent';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PluginTestConponent],
  entryComponents: [PluginTestConponent],
  providers: [{
    provide: 'plugins',
    useValue: [{
      name: 'plugin-test-component',
      component: PluginTestConponent
    }],
    multi: true
  }]
})
export class PluginTestModule { }
