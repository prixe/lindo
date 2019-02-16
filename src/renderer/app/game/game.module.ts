import { CommonModule } from '@angular/common';
import { Compiler, COMPILER_OPTIONS, CompilerFactory, NgModule } from '@angular/core';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '../store/store.module';
import { GameComponent } from './game.component';

const createCompiler = (fn: CompilerFactory): Compiler => {
  return fn.createCompiler();
};

@NgModule({
  declarations: [
    GameComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    {
      provide: COMPILER_OPTIONS,
      useValue: {},
      multi: true
    },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    {
      provide: Compiler,
      useFactory: createCompiler,
      deps: [CompilerFactory]
    }
  ]
})
export class GameModule {
}
