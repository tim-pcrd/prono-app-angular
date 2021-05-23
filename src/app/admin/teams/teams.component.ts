import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group, ITeam } from 'src/app/shared/models/team';
@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: ITeam[] = [];
  displayedColumns: string[] = ['name', 'group', 'action'];

  constructor( private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.teams = (data.teams as ITeam[]).map(team => {
        return {...team, group: Group[team.group]};
      });
    });
  }

}
