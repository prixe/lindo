import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginTestComponent } from './plugin-test.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PluginTestComponent],
  entryComponents: [PluginTestComponent],
  providers: [{
    provide: 'plugins',
    useValue: [{
      name: 'plugin-test-component',
      component: PluginTestComponent
    }],
    multi: true
  }]
})
export class PluginTestModule { }
