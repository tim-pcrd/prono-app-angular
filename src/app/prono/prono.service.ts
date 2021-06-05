import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { map, skip, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { IProno } from '../shared/models/prono';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class PronoService implements OnDestroy {
  myPronos: IProno[] = [];
  allPronos: IProno[] = [];

  pronosSub: Subscription;
  myPronosSub: Subscription;

  constructor(
    private fireStore: AngularFirestore) { }


  createProno(prono: IProno) {
    return this.checkDuplicateData(prono)
      .then(pronos => {
        console.log(pronos);
        if (pronos.length === 0) {

          return this.fireStore.collection('pronos').add(prono);
        }
        // throw new Error('Prono bestaat reeds');
        return Promise.reject('Prono bestaat reeds');
      })


  }

  private checkDuplicateData(prono: IProno) {
    return this.fireStore.collection('pronos', ref => ref.where('matchId', '==', prono.matchId).where('userId','==',prono.userId))
      .valueChanges({idField: 'id'})
      .pipe(take(1))
      .toPromise();
  }

  editProno(prono: IProno) {
    const {id, ...pronoToUpdate} = prono;
    return this.fireStore.collection('pronos').doc(id).update(pronoToUpdate);
  }

  updatePronos(prono: IProno) {
    const index = this.myPronos.findIndex(x => x.id === prono.id);
    if (index >= 0) {
      this.myPronos[index] = prono;
    } else {
      this.myPronos.push(prono);
    }
  }

  getMyPronos(userId): Observable<IProno[]> {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(this.myPronos);
    if (this.myPronos.length > 0){
      return of([...this.myPronos]);
    }
    return this.getMyPronosFromDb(userId);

  }



  private getMyPronosFromDb(userId: string) {
    return this.fireStore.collection('pronos', ref => ref.where('userId', '==', userId))
      .valueChanges({idField: 'id'}).pipe(
        take(1),
        map(pronos => {
          console.log(pronos);
          this.myPronos = pronos as IProno[];
          // if (this.myPronos.length > 0) {
          //   this.myPronosListener(userId);
          // }
          return [...this.myPronos];
        })
      )
  }

  private myPronosListener(userId: string) {
    this.myPronosSub = this.fireStore.collection('pronos', ref => ref.where('userId', '==', userId)).stateChanges()
      .pipe(
        skip(1),
        tap(data => console.log(data))
      )
      .subscribe(actions => actions.forEach(x => {
        const id = x.payload.doc.id;
        const data = x.payload.doc.data() as any;
        const prono = {...data, id};

        if (x.type === 'added') {
          this.myPronos = [...this.myPronos, prono];
        } else if(x.type === 'removed') {
          this.myPronos = this.myPronos.filter(x => x.id !== id);
        } else if(x.type === 'modified') {
          const pronoIndex = this.myPronos.findIndex(x => x.id === id);
          if (pronoIndex >= 0) {
            this.myPronos[pronoIndex] = prono;
          } else {
            this.myPronos = [...this.myPronos, prono];
          }
        }
      }));
  }


  getPronosByMatchId(id: string) {
    return this.getPronosWithScores().pipe(
      map(pronos => {
        return pronos.filter(x => x.matchId === id);
      })
    );
  }

  getPronosWithScores() {
    if (this.allPronos.length > 0){
      return of([...this.allPronos]);
    }

    return this.getPronosWithScoresFromDb();
  }

  getPronosWithScoresFromDb() {
    return this.fireStore.collection('pronos', ref => ref.where('points', '>', -1)).valueChanges({idField: 'id'})
      .pipe(
        take(1),
        map(pronos => {
          console.log('pronos met punten');
          console.log(pronos);
          this.allPronos = pronos as IProno[];
          if (this.allPronos.length > 0) {
            this.PronosListener();
          }
          return [...this.allPronos];
        })
      );
  }

  private PronosListener() {
    this.pronosSub = this.fireStore.collection('pronos', ref => ref.where('points', '>', -1)).stateChanges()
      .pipe(
        skip(1),
        tap(data => {
          console.log('======================= prono listener =================');
          console.log(data);
        })
      )
      .subscribe(actions => actions.forEach(x => {
        const id = x.payload.doc.id;
        const data = x.payload.doc.data() as any;
        const prono = {...data, id};

        if (x.type === 'added') {
          this.allPronos = [...this.allPronos, prono];
          const myPronoIndex = this.myPronos.findIndex(x => x.id === id);
          if (myPronoIndex >= 0) {
            this.myPronos[myPronoIndex] = prono;
          }
        } else if(x.type === 'removed') {
          this.allPronos = this.allPronos.filter(x => x.id !== id);
        } else if(x.type === 'modified') {
          const pronoIndex = this.allPronos.findIndex(x => x.id === id);
          if (pronoIndex >= 0) {
            this.allPronos[pronoIndex] = prono;
          } else {
            this.allPronos = [...this.allPronos, prono];
          }

          const myPronoIndex = this.myPronos.findIndex(x => x.id === id);
          if (myPronoIndex >= 0) {
            this.myPronos[myPronoIndex] = prono;
          }
        }
      }));
  }

  ngOnDestroy(): void {
    this.clearPronoService();
  }



  clearPronoService() {
    this.pronosSub?.unsubscribe();
    this.myPronosSub?.unsubscribe();
    this.myPronos = [];
    this.allPronos = [];
  }

}
