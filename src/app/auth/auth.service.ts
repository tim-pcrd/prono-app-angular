import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, of, ReplaySubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { MatchService } from '../admin/matches/match.service';
import { TeamService } from '../admin/teams/team.service';
import { PronoService } from '../prono/prono.service';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private toastrService: ToastrService,
    private router: Router,
    private matchService: MatchService,
    private teamService: TeamService,
    private pronoService: PronoService) { }

  register(name: string, email: string, password: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(x => {
        return this.createUser(x.user.uid, name);
      })
      .then(x => {
        this.router.navigateByUrl('');
        this.toastrService.success('Login succesvol');
      })
      .catch(error => {
        this.errorHandling(error);
      });
  }

  login(email: string, password: string, returnUrl: string) {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(x => {
        return this.getUser(x.user.uid);
      })
      .then(user => {
        console.log(user);
        this.currentUserSource.next(user as IUser);
        this.router.navigateByUrl(returnUrl);
        this.toastrService.success('Login succesvol');
      })
      .catch(error => {
        this.errorHandling(error);
      });
  }

  logout() {
    this.afAuth.signOut()
      .then(x => {
        this.teamService.clearTeamService();
        this.matchService.clearMatchService();
        this.pronoService.clearPronoService();
        this.currentUserSource.next(null);
        this.router.navigateByUrl('/auth/login');
        this.toastrService.success('Succesvol uitgelogd.')
      })
      .catch(error => {
        this.errorHandling(error);
      })
  }

  checkDisplayName(displayName: string) {
    return this.fireStore.collection('users', ref =>
      ref.where('displayName_lowercase', '==', displayName.toLowerCase())).valueChanges({idField: 'id'})
        .pipe(take(1), tap(x => console.log(x)));
  }


  resetPassword(email: string) {
    this.afAuth.sendPasswordResetEmail(email)
      .then(x => {
        console.log(x);
        this.toastrService.success('We hebben je een mail gestuurd waarmee je jouw wachtwoord kan resetten.')
      })
      .catch(error => {
        let errorMessage = 'Er is een fout opgetreden.';
        if (error?.code === 'auth/user-not-found') {
          errorMessage = 'Er bestaat geen account met dit e-mailadres.';
        }
        this.toastrService.error(errorMessage);
      })
  }

  confirmPasswordReset(password: string, code: string) {
    this.afAuth.confirmPasswordReset(code, password)
      .then(x => {
        console.log(x);
        this.router.navigateByUrl('/auth/login');
        this.toastrService.success('Je wachtwoord is succesvol gewijzigd.')
      })
      .catch(error => {
        console.log(error);
        this.errorHandling(error);
      })
  }


  private createUser(uid: string, displayName: string) {
    return this.fireStore.collection('users').doc(uid).set({displayName, displayName_lowercase: displayName.toLowerCase()})
  }



  private errorHandling(error:any) {
    console.log(error);
    let message: string = 'Er is een fout opgetreden';

    switch(error.code) {
      case 'auth/email-already-in-use':
        message = 'Dit e-mailadres is al in gebruik.'
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'E-mail of wachtwoord ongeldig.';
        break;
      case 'auth/user-disabled':
        message = 'Dit account is geblokkeerd.'
        break;
    }

    this.toastrService.error(message);
  }

  async getAuthState() {
    // this.afAuth.onAuthStateChanged(user => {
    //   if (user) {
    //     this.fireStore.collection('users').doc(user.uid).valueChanges({idField: 'id'})
    //       .pipe(
    //         take(1)
    //       )
    //       .subscribe(user => {
    //         console.log(user);
    //         this.currentUserSource.next(user as IUser);
    //       });
    //   } else {
    //     console.log('user is null');
    //     this.currentUserSource.next(null);
    //   }
    // })

    const user = await this.afAuth.authState.pipe(take(1)).toPromise();
    console.log(user);
    if (user) {
      const currentUser = await this.getUser(user.uid);
      this.currentUserSource.next(currentUser as IUser);
    } else {
      this.currentUserSource.next(null);
    }
  }

  private getUser(id: string) {
    return this.fireStore.collection('users').doc(id).valueChanges({idField: 'id'}).pipe(take(1)).toPromise();
  }
}
