import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, skip, take, tap } from 'rxjs/operators';
import { IMatch } from '../shared/models/match';
import { Group, ITeam } from '../shared/models/team';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private teams: ITeam[] = [];
  private matches: IMatch[] = [];

  constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage, private router: Router) { }



  


}

