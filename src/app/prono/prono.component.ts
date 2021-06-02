import { getSupportedInputTypes } from '@angular/cdk/platform';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { IMatch, Stage } from '../shared/models/match';
import { IProno } from '../shared/models/prono';
import { ITeam } from '../shared/models/team';
import { IUser } from '../shared/models/user';
import { PronoService } from './prono.service';

@Component({
  selector: 'app-prono',
  templateUrl: './prono.component.html',
  styleUrls: ['./prono.component.scss']
})
export class PronoComponent implements OnInit, OnDestroy {
  groupMatches: IMatch[];
  roundOf16Matches: IMatch[];
  quarterFinalMatches: IMatch[];
  semiFinalMatches: IMatch[];
  finalMatches: IMatch[];
  matchesWithTeamsAndPronos: IMatch[];
  user: IUser;
  userSub: Subscription;
  selectedTab: number;

  constructor(private route: ActivatedRoute, private authService: AuthService, private pronoService: PronoService) { }


  ngOnInit(): void {
    const teams: ITeam[] = this.route.snapshot.data['teams'];
    const matches: IMatch[] = this.route.snapshot.data['matches'];
    this.userSub = this.authService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        this.user = user;
        return this.pronoService.getMyPronos(user.id);
      })
    )
    .subscribe(pronos => {
      this.matchesWithTeamsAndPronos = matches.map((match: IMatch) => {
        const homeTeam = teams.find(x => x.id === match.homeTeamId);
        const awayTeam = teams.find(x => x.id === match.awayTeamId);
        const prono = pronos.find(x => x.userId === this.user.id && x.matchId === match.id);
        return {...match, homeTeam, awayTeam,  prono: prono}
      });

      console.log(this.matchesWithTeamsAndPronos);

      this.groupMatches = this.getMatchesByStage('1');
      this.roundOf16Matches = this.getMatchesByStage('2');
      this.quarterFinalMatches = this.getMatchesByStage('3');
      this.semiFinalMatches = this.getMatchesByStage('4');
      this.finalMatches = this.getMatchesByStage('5');

      this.setSelectedTab();

    });
  }

  private getMatchesByStage(stage: string) {
    return this.matchesWithTeamsAndPronos.filter(x => x.stage === stage);
  }

  private setSelectedTab() {
    if (this.finalMatches.length > 0) {
      this.selectedTab = 4;
    } else if (this.semiFinalMatches.length > 0) {
      this.selectedTab = 3;
    } else if (this.quarterFinalMatches.length > 0) {
      this.selectedTab = 2;
    } else if (this.roundOf16Matches.length > 0) {
      this.selectedTab = 1;
    } else {
      this.selectedTab = 0;
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }








}
