import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
export class PronoComponent implements OnInit {
  matchesWithTeamsAndPronos: IMatch[];
  user: IUser;

  constructor(private route: ActivatedRoute, private authService: AuthService, private pronoService: PronoService) { }

  ngOnInit(): void {
    const teams: ITeam[] = this.route.snapshot.data['teams'];
    const matches: IMatch[] = this.route.snapshot.data['matches'];
    this.authService.currentUser$.pipe(
      switchMap(user => {
        this.user = user;
        return this.pronoService.getMyPronos(user.id);
      })
    )
    .subscribe(pronos => {
      this.matchesWithTeamsAndPronos = matches.map((match: IMatch) => {
        const homeTeam = teams.find(x => x.id === match.homeTeamId);
        const awayTeam = teams.find(x => x.id === match.awayTeamId);
        const prono = pronos.find(x => x.userId === this.user.id);
        return {...match, homeTeam, awayTeam,  prono: prono}
      })
      console.log(this.matchesWithTeamsAndPronos);
    });





  }

}
