import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    imports: [],
    declarations: [],
    providers: [],
    exports: [
        FlexLayoutModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatCardModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatProgressBarModule,
        MatTabsModule,
        MatMenuModule,
        MatTooltipModule,
        MatDialogModule,
        MatSelectModule
    ]
})
export class MaterialModule { }
