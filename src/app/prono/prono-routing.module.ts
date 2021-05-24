import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PronoComponent } from './prono.component';
import { MatchesResolver } from '../admin/matches/matches-resolver.service';
import { TeamsResolver } from '../admin/teams/teams-resolver.service';

const routes: Routes = [
  {path:'', component: PronoComponent, resolve: {matches: MatchesResolver, teams: TeamsResolver}}
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
export class PronoRoutingModule { }
