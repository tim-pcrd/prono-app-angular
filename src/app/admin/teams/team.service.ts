import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { take, map, skip, tap } from 'rxjs/operators';
import { Group, ITeam } from 'src/app/shared/models/team';
import * as _ from 'lodash';
import { JsonpClientBackend } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teams: ITeam[] = [];
  private sub: Subscription;

  constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage, private router: Router) { }

  createTeam(team: ITeam, file) {
    this.storage.upload(file.name, file)
      .then(x => x.ref.getDownloadURL())
      .then(url => {
        team.url = url;
        return this.fireStore.collection('teams').add(team);
      })
      .then(x => {
        console.log(x);
        this.router.navigateByUrl('/admin/ploegen');
      })
      .catch(error => console.log(error));
  }

  getTeamById(id: string) {
    return this.getAllTeams().pipe(
      map(teams => {
        return {...teams.find(x => x.id === id)};
      })
    )
  }

  getAllTeams() : Observable<ITeam[]> {

    if (this.teams.length === 0){
      const teamsFromLocalStorage : ITeam[] = JSON.parse(localStorage.getItem('teams'));
      if (teamsFromLocalStorage?.length > 0) {
        this.teams = teamsFromLocalStorage;
        console.log('teams from localstorage');
        console.log(this.teams);
        return of([...this.teams]);
      }

      return this.getTeamsFromDb();
    }


    return of([...this.teams]);
  }

  private getTeamsFromDb() {
    return this.fireStore.collection('teams').valueChanges({idField: 'id'})
    .pipe(
      take(1),
      map((teams: any[]) => {
        this.teams = _.orderBy(teams, ['group', 'name']);
        localStorage.setItem('teams', JSON.stringify(this.teams));
        console.log('teams from db');
        console.log(this.teams);
        if (this.teams.length > 0) {
          this.teamListener();
        }
        return [...this.teams];
      })
    );
  }

  private teamListener() {
    this.sub = this.fireStore.collection('teams').stateChanges()
      .pipe(
        skip(1),
        tap(data => console.log(data))
      )
      .subscribe(actions => actions.forEach(x => {
        const id = x.payload.doc.id;
        const data = x.payload.doc.data() as any;
        const team = {...data, id} as ITeam;

        if (x.type === 'added') {
          this.teams = [...this.teams, team];
        } else if(x.type === 'removed') {
          this.teams = this.teams.filter(x => x.id !== id);
        } else if(x.type === 'modified') {
          const teamIndex = this.teams.findIndex(x => x.id === id);
          if (teamIndex >= 0) {
            this.teams[teamIndex] = team;
          }
        }
        this.teams = _.orderBy([...this.teams], ['group', 'name']) ;
      }));
  }

  clearTeamService() {
    this.teams = [];
    this.sub?.unsubscribe();
  }


}
