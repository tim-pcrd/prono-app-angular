import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Stage } from 'src/app/shared/models/match';
import { ITeam } from 'src/app/shared/models/team';
import { AdminService } from '../../admin.service';
import { MatchService } from '../match.service';


@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrls: ['./create-match.component.scss']
})
export class CreateMatchComponent implements OnInit {
  matchForm: FormGroup;
  stages = Stage;
  teamsByGroup: any;

  constructor(private route: ActivatedRoute, private matchService: MatchService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const teams = data.teams as ITeam[];
      this.teamsGrouping(teams);
    });
    this.createMatchForm();
  }

  getKeys(obj: any) {
    const numberOfKeys =  Object.keys(obj).length;
    return Object.keys(obj).slice(0, numberOfKeys/2);
  }

  private createMatchForm() {
    this.matchForm = new FormGroup({
      date: new FormControl('', Validators.required),
      stage: new FormControl('', Validators.required),
      homeTeamId: new FormControl('', Validators.required),
      awayTeamId: new FormControl('', Validators.required)
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
    console.log(this.matchForm.value);
    if (this.matchForm.valid) {
      const matchToCreate = {...this.matchForm.value, date: this.matchForm.value.date.toDate()}
      this.matchService.createMatch(matchToCreate);
    }

  }

}
