import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { IProno } from '../shared/models/prono';

@Injectable({
  providedIn: 'root'
})
export class PronoService {
  myPronos: IProno[] = [];

  constructor(
    private fireStore: AngularFirestore,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService) { }

  createProno(prono: IProno) {
    return this.fireStore.collection('pronos').add(prono)

  }

  private checkDuplicateData(prono: IProno) {
    return this.fireStore.collection('pronos', ref => ref.where('matchId', '==', prono.userId)).valueChanges({idField: 'id'})
      .pipe(
        map(pronos => {
          return (pronos as IProno[]).find(p => p.userId === prono.userId);
        })
      ).toPromise();
  }

  editProno(prono: IProno) {
    const {id, ...pronoToUpdate} = prono;
    return this.fireStore.collection('pronos').doc(id).update(pronoToUpdate);
  }

  getMyPronos(userId): Observable<IProno[]> {
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
          this.myPronos = pronos as IProno[];
          return this.myPronos;
        })
      )
  }



}
