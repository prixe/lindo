/* SystemJS module definition */
import { System } from 'systemjs';

declare var nodeModule: NodeModule;

interface NodeModule {
  id: string;
}

declare const SystemJS: System;
declare var window: Window;

interface Window {
  process: any;
  require: any;
}
