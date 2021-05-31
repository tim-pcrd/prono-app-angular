import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { TeamsComponent } from './teams/teams.component';
import { MatchesComponent } from './matches/matches.component';
import { CreateTeamComponent } from './teams/create-team/create-team.component';
import { TeamsResolver } from './teams/teams-resolver.service';
import { MatchesResolver } from './matches/matches-resolver.service';
import { CreateMatchComponent } from './matches/create-match/create-match.component';
import { EditMatchComponent } from './matches/edit-match/edit-match.component';
import { MatchPronosComponent } from './matches/match-pronos/match-pronos.component';

const routes: Routes = [
  {path: '', component: AdminComponent},
  {path: 'ploegen', component: TeamsComponent, resolve: {teams: TeamsResolver}},
  {path: 'ploegen/nieuw', component: CreateTeamComponent},
  {path: 'wedstrijden', component: MatchesComponent, resolve: {matches: MatchesResolver, teams: TeamsResolver}},
  {path: 'wedstrijden/nieuw', component: CreateMatchComponent, resolve: {teams: TeamsResolver}},
  {path: 'wedstrijden/:id', component: EditMatchComponent, resolve: {teams: TeamsResolver}},
  {path: 'wedstrijden/:id/pronos', component: MatchPronosComponent}
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
