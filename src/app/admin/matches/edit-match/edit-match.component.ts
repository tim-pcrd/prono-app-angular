import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IMatch, Stage } from 'src/app/shared/models/match';
import { ITeam } from 'src/app/shared/models/team';
import { AdminService } from '../../admin.service';
import * as moment from 'moment';
import { MatchService } from '../match.service';

@Component({
  selector: 'app-edit-match',
  templateUrl: './edit-match.component.html',
  styleUrls: ['./edit-match.component.scss']
})
export class EditMatchComponent implements OnInit, OnDestroy {
  matchForm: FormGroup;
  currentMatch: IMatch;
  matchId: string;
  stages = Stage;
  teamsByGroup: any;
  sub: Subscription;
  deleteProgress:number = 0;

  constructor(private route: ActivatedRoute, private matchService: MatchService, private router: Router) { }


  ngOnInit(): void {
    this.sub = combineLatest([
      this.route.data,
      this.route.paramMap
    ])
    .pipe(
      switchMap(([data, params]) => {
        this.teamsGrouping(data.teams as ITeam[]);
        this.matchId = params.get('id');
        return this.matchService.getMatchById(this.matchId);
      })
    )
    .subscribe(match => {
      console.log(match)
      this.currentMatch = match;
      this.createMatchForm(this.currentMatch);
    });
  }

  getKeys(obj: any) {
    const numberOfKeys =  Object.keys(obj).length;
    return Object.keys(obj).slice(0, numberOfKeys/2);
  }

  private createMatchForm(match: IMatch) {
    this.matchForm = new FormGroup({
      date: new FormControl(moment(match.date), Validators.required),
      stage: new FormControl(match.stage, Validators.required),
      homeTeamId: new FormControl(match.homeTeamId, Validators.required),
      awayTeamId: new FormControl(match.awayTeamId, Validators.required),
      homeTeamScore: new FormControl(match.homeTeamScore),
      awayTeamScore: new FormControl(match.awayTeamScore)
    });
  }

  private teamsGrouping(teams: ITeam[]) {
    this.teamsByGroup = teams.reduce((acc, value) => {
      if (!acc[value.group]) { acc[value.group] = [] }

      acc[value.group].push(value);
      return acc;
    }, {})
    console.log(this.teamsByGroup);
  }

  submit() {
    if (this.matchForm.valid) {
      const matchToCreate = {...this.matchForm.value, date: this.matchForm.value.date.toDate(), id: this.matchId}
      this.matchService.editMatch(matchToCreate);
    }
  }

  holdHandler(e) {
    console.log(e);
    this.deleteProgress = (e / 10);
    if (this.deleteProgress > 100) {
      this.delete();
    }

  }

  delete() {
    this.matchService.deleteMatch(this.currentMatch.id);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
