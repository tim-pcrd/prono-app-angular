import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, skip, take, tap } from 'rxjs/operators';
import { IMatch } from '../shared/models/match';
import { Group, ITeam } from '../shared/models/team';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private teams: ITeam[] = [];
  private matches: IMatch[] = [];

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

  getAllTeams() : Observable<ITeam[]> {
    if (this.teams.length === 0){
      return this.getTeamsFromDb();
    }

    return of([...this.teams]);
  }

  private getTeamsFromDb() {
    return this.fireStore.collection('teams').valueChanges({idField: 'id'})
    .pipe(
      take(1),
      map((teams: any[]) => {
        this.teams = teams.map(team => ({...team, group: Group[team.group]}))
        console.log(this.teams);
        this.teamListener();
        return this.teams;
      })
    );
  }

  private teamListener() {
    this.fireStore.collection('teams').stateChanges()
      .pipe(
        skip(1),
        tap(data => console.log(data))
      )
      .subscribe(actions => actions.forEach(x => {
        const id = x.payload.doc.id;
        const data = x.payload.doc.data() as any;
        const team = {...data, group: Group[data.group], id} as ITeam;

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
      }));
  }

  createMatch(match: IMatch) {
    this.fireStore.collection('teams').add(match)
      .then()
      .catch();
  }

  getAllMatches(): Observable<IMatch[]> {
    if(this.matches.length > 0) {
      return of([...this.matches])
    }

    return this.getMatchesFromDb();
  }

  private getMatchesFromDb() {
    return this.fireStore.collection('matches').valueChanges({idField: 'id'})
      .pipe(
        take(1),
        tap(x => console.log(x)),
        map(matches => {
          this.matchListener();
          return matches as IMatch[];
        })
      );
  }

  private matchListener() {
    this.fireStore.collection('matches').stateChanges()
      .pipe(
        skip(1),
        tap(data => console.log(data))
      )
      .subscribe(actions => actions.forEach(x => {
        const id = x.payload.doc.id;
        const data = x.payload.doc.data() as any;
        const match = {...data, group: Group[data.group], id} as IMatch;

        if (x.type === 'added') {
          this.matches = [...this.matches, match];
        } else if(x.type === 'removed') {
          this.matches = this.matches.filter(x => x.id !== id);
        } else if(x.type === 'modified') {
          const matchIndex = this.matches.findIndex(x => x.id === id);
          if (matchIndex >= 0) {
            this.matches[matchIndex] = match;
          }
        }
      }));
  }


}

