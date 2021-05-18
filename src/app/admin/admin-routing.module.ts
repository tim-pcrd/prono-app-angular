import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { TeamsComponent } from './teams/teams.component';
import { MatchesComponent } from './matches/matches.component';
import { CreateTeamComponent } from './teams/create-team/create-team.component';
import { TeamsResolver } from './teams/teams-resolver.service';

const routes: Routes = [
  {path: '', component: AdminComponent},
  {path: 'ploegen', component: TeamsComponent, resolve: {teams: TeamsResolver}},
  {path: 'ploegen/nieuw', component: CreateTeamComponent},
  {path: 'wedstrijden', component: MatchesComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
