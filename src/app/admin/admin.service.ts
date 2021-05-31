import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, skip, take, tap } from 'rxjs/operators';
import { IMatch } from '../shared/models/match';
import { Group, ITeam } from '../shared/models/team';
import * as _ from 'lodash';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  allPlayers: IUser[] = [];

  constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage, private router: Router) { }

  getPlayers() {
    if (this.allPlayers.length > 0) {
      return of([...this.allPlayers]);
    }

    return this.getPlayersFromDb();
  }

  private getPlayersFromDb() {
    return this.fireStore.collection('users').valueChanges({idField: 'id'})
      .pipe(
        take(1),
        map(users => {
          this.allPlayers = users as IUser[];
          return [...this.allPlayers];
        })
      );

  }






}

