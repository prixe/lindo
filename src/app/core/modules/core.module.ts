import { NgModule } from '@angular/core';
import { SafePipe } from 'app/core/pipes/safe.pipe';

@NgModule({
    imports: [ /* Shared modules */],
    declarations: [
        SafePipe
    ],
    providers: [],
    exports: [
        SafePipe
    ]
})
export class CoreModule {}
