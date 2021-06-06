import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatchService } from 'src/app/admin/matches/match.service';
import { TeamService } from 'src/app/admin/teams/team.service';
import { IMatch } from 'src/app/shared/models/match';
import { IProno } from 'src/app/shared/models/prono';
import { EditScoreComponent } from '../edit-score/edit-score.component';
import { PronoService } from '../prono.service';
import * as _ from 'lodash';
import { AdminService } from 'src/app/admin/admin.service';

@Component({
  selector: 'app-prono-details',
  templateUrl: './prono-details.component.html',
  styleUrls: ['./prono-details.component.scss']
})
export class PronoDetailsComponent implements OnInit, OnDestroy {
  vm: {pronos?: IProno[]; match?: IMatch};
  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private pronoService: PronoService,
    private matchService: MatchService,
    private teamService: TeamService,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<EditScoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMatch) { }


  ngOnInit(): void {
    console.log(this.data);
    this.sub = combineLatest([
      this.pronoService.getPronosByMatchId(this.data.id),
      this.adminService.getPlayers()
    ]).subscribe(([pronos, players]) => {
      const match = {...this.data};
      let pronosWithPlayers = pronos.map(prono => {
        return {...prono, user: players.find(x => x.id === prono.userId)}
      });
      pronosWithPlayers = _.orderBy(pronosWithPlayers, 'user.displayName');
      this.vm = {match, pronos: pronosWithPlayers};
    });

  }

  private getData() {
    this.sub = this.route.paramMap.pipe(
      switchMap(params => {
        const matchId = params.get('id');
        return combineLatest([
          this.pronoService.getPronosByMatchId(matchId),
          this.matchService.getMatchById(matchId)
        ])
      }),
      switchMap(([pronos, match]) => {
        this.vm.pronos = pronos;
        this.vm.match = match;
        return combineLatest([
          this.teamService.getTeamById(match.homeTeamId),
          this.teamService.getTeamById(match.awayTeamId),
          this.adminService.getPlayers()
        ])
      })
    ).subscribe(([homeTeam, awayTeam, players]) => {
      this.vm.match = {...this.vm.match, homeTeam, awayTeam};
      this.vm.pronos = this.vm.pronos.map(prono => {
        return {...prono, user: players.find(x => x.id === prono.userId)}
      })
    })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
