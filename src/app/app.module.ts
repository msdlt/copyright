import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MatCardModule, MatListModule, MatExpansionModule, MatTabsModule, MatSidenavModule, MatIconModule, MatToolbarModule, MatButtonModule, MatCheckboxModule, MatGridListModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FilterComponent } from './filter/filter.component';

const appRoutes: Routes = [
    { path: 'filters', component: FilterComponent },
    { path: '', component: HomeComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        FilterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        MatCardModule, 
        MatListModule,
        MatExpansionModule,
        MatTabsModule,
        MatSidenavModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatCheckboxModule,
        MatGridListModule,
        FlexLayoutModule,
        FontAwesomeModule,
        RouterModule.forRoot(
            appRoutes,
            { 
                //enableTracing: true // <-- debugging purposes only
            } 
        )
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
