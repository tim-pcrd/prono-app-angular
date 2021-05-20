import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { TeamsComponent } from './teams/teams.component';
import { MatchesComponent } from './matches/matches.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { CreateTeamComponent } from './teams/create-team/create-team.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateMatchComponent } from './matches/create-match/create-match.component';
import {
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { EditMatchComponent } from './matches/edit-match/edit-match.component';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS"
  },
  display: {
    dateInput: "DD/MM/YYYY, HH:mm",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};


@NgModule({
  declarations: [
    AdminComponent,
    TeamsComponent,
    MatchesComponent,
    CreateTeamComponent,
    CreateMatchComponent,
    EditMatchComponent,

  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    FlexLayoutModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatDatepickerModule
  ],
  providers: [
    {provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}
  ]

})
export class AdminModule { }
