import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MatCardModule, MatListModule, MatExpansionModule, MatTabsModule, MatSidenavModule, MatIconModule, MatToolbarModule, MatButtonModule, MatCheckboxModule, MatGridListModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShareButtonsModule } from '@ngx-share/buttons';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FilterComponent } from './filter/filter.component';
import { FooterComponent } from './footer/footer.component';
import { KeepHtmlPipe } from './keep-html.pipe';

const appRoutes: Routes = [
    { path: 'filters', component: FilterComponent },
    { path: '', component: HomeComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        FilterComponent,
        FooterComponent,
        KeepHtmlPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
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
        MatTooltipModule,
        FlexLayoutModule,
        FontAwesomeModule,
        ShareButtonsModule,
        RouterModule.forRoot(
            appRoutes, {
                scrollPositionRestoration: 'enabled'
            }
        )
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
