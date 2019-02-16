import { AfterViewInit, Compiler, Component, Injector, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'game-root',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  @ViewChild('content', {read: ViewContainerRef}) content: ViewContainerRef;

  constructor(private _compiler: Compiler,
              private _injector: Injector) {
  }

  ngAfterViewInit(): void {
    // this.loadPlugins();
  }

  private async loadPlugins(): Promise<void> {
    // import external module bundle
    const module = await SystemJS.import('assets/plugins/plugin-test.bundle.js');

    const moduleFactory = await this._compiler
      .compileModuleAsync<any>(module[ 'PluginTestModule' ]);

    // resolve component factory
    const moduleRef = moduleFactory.create(this._injector);

    // get the custom made provider name 'plugins'
    const componentProvider = moduleRef.injector.get<Array<Array<{ name: string, component: new() => void }>>>('plugins' as any);

    const componentTest = componentProvider[ 0 ].find(c => c.name === 'plugin-test-component');

    // from plugins array load the component on position 0
    const componentFactory = moduleRef.componentFactoryResolver
      .resolveComponentFactory<any>(componentTest.component);

    // compile component
    const pluginComponent = this.content.createComponent(componentFactory);
  }
}
