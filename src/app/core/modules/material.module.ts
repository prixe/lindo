import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatTooltipModule
} from '@angular/material';

@NgModule({
    imports: [],
    declarations: [],
    providers: [],
    exports: [
        FlexLayoutModule,
        MatButtonModule,
        MatCheckboxModule,
        //MdRadioModule,
        MatInputModule,
        MatCardModule,
        MatSidenavModule,
        //MdToolbarModule,
        MatListModule,
        //MdGridListModule,
        MatIconModule,
        MatProgressBarModule,
        MatTabsModule,
        //MdSlideToggleModule,
        //MdButtonToggleModule,
        //MdSliderModule,
        MatMenuModule,
        MatTooltipModule,
        MatDialogModule,
        //MdSnackBarModule,
        MatSelectModule
    ]
})
export class MaterialModule { }
