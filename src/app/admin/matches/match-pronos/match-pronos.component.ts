import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IMatch } from 'src/app/shared/models/match';
import { IProno } from 'src/app/shared/models/prono';
import { TeamService } from '../../teams/team.service';
import { MatchService } from '../match.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-match-pronos',
  templateUrl: './match-pronos.component.html',
  styleUrls: ['./match-pronos.component.scss']
})
export class MatchPronosComponent implements OnInit {
  pronos: IProno[];
  match: IMatch;
  matchId: string;
  displayedColumns = ['name', 'prono', 'points']

  constructor(private route: ActivatedRoute, private matchService: MatchService, private router: Router, private teamService: TeamService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(data => {
        this.matchId = data.get('id');
        return combineLatest([
          this.matchService.getMatchById(this.matchId),
          this.matchService.getPronosByMatchId(this.matchId)
        ])
      })
    )
    .subscribe(([match, pronos]) => {
      if (!match) {
        this.router.navigateByUrl('/admin/wedstrijden');
      } else {
        this.pronos = pronos;
        this.match = {...match};
        this.teamService.getTeamById(this.match.homeTeamId).subscribe(team => {
          this.match.homeTeam = team;
        });
        this.teamService.getTeamById(this.match.awayTeamId).subscribe(team => {
          this.match.awayTeam = team;
        })
      }
    });
  }

}
