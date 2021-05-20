import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMatch, Stage } from 'src/app/shared/models/match';
import { ITeam } from 'src/app/shared/models/team';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {
  matchesWithTeams: IMatch[] = [];
  displayedColumns: string[] = ['date', 'stage', 'homeTeam', 'awayTeam', 'score'];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const teams: ITeam[] = this.route.snapshot.data['teams'];
    const matches: IMatch[] = this.route.snapshot.data['matches'];

    console.log(matches);

    this.matchesWithTeams = [...matches].map((match: IMatch) => {
      const homeTeam = teams.find(x => x.id === match.homeTeamId);
      const awayTeam = teams.find(x => x.id === match.awayTeamId);
      return {...match, homeTeam, awayTeam, stage: Stage[match.stage]}
    })
    console.log(this.matchesWithTeams);
  }

  openEdit(id: string) {
    this.router.navigateByUrl(`/admin/wedstrijden/${id}/edit`);
  }

}
