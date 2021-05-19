import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Group, ITeam } from 'src/app/shared/models/team';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: ITeam[] = [];
  displayedColumns: string[] = ['name', 'group', 'action'];

  constructor(private adminService: AdminService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.teams = data.teams as ITeam[];
    });
  }

}
