import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { map, take, tap, skip, catchError } from 'rxjs/operators';
import { IMatch } from 'src/app/shared/models/match';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { PronoService } from 'src/app/prono/prono.service';
import { IProno } from 'src/app/shared/models/prono';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private matches: IMatch[] = [];
  private sub: Subscription;


  constructor(
    private fireStore: AngularFirestore,
    private router: Router,
    private toastrService: ToastrService) { }

  createMatch(match: IMatch) {
    this.fireStore.collection('matches').add(match)
      .then(x => {
        this.router.navigateByUrl('/admin/wedstrijden');
        this.toastrService.success('Succesvol opgeslagen.');
      })
      .catch(error => {
        console.log(error);
        this.toastrService.error('Er is een fout opgetreden.');
      });
  }

  editMatch(match: IMatch) {
    const {id, ...matchToUpdate} = match;
    console.log(id);
    this.fireStore.collection('matches').doc(id).update(matchToUpdate)
      .then(x => {
        console.log(x);
        if (matchToUpdate.homeTeamScore != null && matchToUpdate.awayTeamScore != null) {
          return this.fireStore.collection('pronos', ref => ref.where('matchId', '==', id))
            .valueChanges({idField: 'id'})
            .pipe(take(1))
            .toPromise();
        } else {
          return null;
        }
      })
      .then(pronos => {
        if (pronos) {
          const promiseArr = [];
          for(const prono of pronos) {
            const points = this.getPoints(matchToUpdate, prono as IProno);
            console.log(points);
            const _prono = {...prono, points};
            const {id, ...pronoToUpdate} = _prono;
            promiseArr.push(this.fireStore.collection('pronos').doc(id).update(pronoToUpdate))
          }
          return Promise.all(promiseArr);
        } else {
          return null;
        }
      })
      .then(() => {
        this.router.navigateByUrl('/admin/wedstrijden');
        this.toastrService.success('Succesvol opgeslagen.');
      })
      .catch(error => {
        console.log(error);
        this.toastrService.error('Er is een fout opgetreden');
      });
  }

  deleteMatch(id: string) {
    this.fireStore.collection('pronos', ref => ref.where('matchId', '==', id)).valueChanges({idField: 'id'})
      .pipe(take(1))
      .toPromise()
      .then((pronos) => {
        var batch = this.fireStore.firestore.batch();

        for (const prono of pronos) {
          batch.delete(this.fireStore.firestore.collection('pronos').doc(prono.id));
          console.log(prono);
        }
        batch.delete(this.fireStore.firestore.collection('matches').doc(id))
        return batch.commit()
      })
      .then(() => {
        this.toastrService.success('Succesvol verwijderd.');
        this.router.navigateByUrl('/admin/wedstrijden');
      })
      .catch(error => {
        console.log(error);
        this.toastrService.error('Er is een fout opgetreden');
      });
  }

  getMatchById(id: string): Observable<IMatch> {
    return this.getAllMatches().pipe(
      map(matches => {
        return {...matches.find(x => x.id === id)}
      })
    );
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
          this.matches = _.orderBy(matches.map((match:any) => ({...match, date: match.date.toDate()})), ['date']);
          if(this.matches.length > 0) {
            this.matchListener();
          }
          return [...this.matches];
        })
      );
  }

  private matchListener() {
    this.sub = this.fireStore.collection('matches').stateChanges()
      .pipe(
        skip(1),
        tap(data => console.log(data))
      )
      .subscribe(actions => actions.forEach(x => {
        const id = x.payload.doc.id;
        const data = x.payload.doc.data() as any;
        const match = {...data, id, date: data.date.toDate()} as IMatch;

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
        this.matches = _.orderBy([...this.matches], ['date']);
      }));
  }

  clearMatchService() {
    this.matches = [];
    this.sub?.unsubscribe();
  }

  getPoints(match: IMatch, prono: IProno) {
    if (
      match.homeTeamScore != null && match.awayTeamScore != null
      && prono.homeTeamScore != null && prono.awayTeamScore != null) {
        const ht = match.homeTeamScore;
        const at = match.awayTeamScore;
        const pht = prono.homeTeamScore;
        const pat = prono.awayTeamScore;

        if ((ht === pht) && (at === pat)) {
          return 5;
        }

        if(((ht === 0) && (at === 0) && (pht > 0) && (pat > 0) && (pht-pat === 0))
         || ((pht === 0) && (pat === 0) && (ht > 0) && (at > 0) && (ht-at === 0)) ) {
          return 1;
        }


        if ((ht - at) === (pht - pat)) {
          return 2;
        }

        if (((ht-at > 1) && (pht - pat > 1)) || ((ht-at < -1) && (pht - pat < -1))) {
          return 2;
        }

        if (((ht-at >= 1) && (pht - pat >= 1)) || ((ht-at <= -1) && (pht - pat <= -1))) {
          return 1;
        }

        return 0;
    }
  }


}
