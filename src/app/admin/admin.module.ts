import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { TeamsComponent } from './teams/teams.component';
import { MatchesComponent } from './matches/matches.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { CreateTeamComponent } from './teams/create-team/create-team.component';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    AdminComponent,
    TeamsComponent,
    MatchesComponent,
    CreateTeamComponent,

  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    FlexLayoutModule
  ]
})
export class AdminModule { }
