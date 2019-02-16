import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ElectronService } from './providers/electron.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ElectronService
  ]
})
export class SharedModule {
}
