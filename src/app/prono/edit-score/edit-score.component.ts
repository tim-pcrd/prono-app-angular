import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IMatch } from 'src/app/shared/models/match';
import { IProno } from 'src/app/shared/models/prono';
import { IUser } from 'src/app/shared/models/user';
import { PronoService } from '../prono.service';

@Component({
  selector: 'app-edit-score',
  templateUrl: './edit-score.component.html',
  styleUrls: ['./edit-score.component.scss']
})
export class EditScoreComponent implements OnInit, OnDestroy {
  pronoForm: FormGroup;
  userSub: Subscription;

  constructor(
    private dialogRef: MatDialogRef<EditScoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMatch,
    private authService: AuthService,
    private pronoService: PronoService,
    private toastrService: ToastrService) { }



  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.createPronoForm(user.id);
    })

    console.log(this.data);
  }

  createPronoForm(userId: string) {
    this.pronoForm = new FormGroup({
      userId: new FormControl(userId, [Validators.required]),
      homeTeamScore: new FormControl(this.data.prono?.homeTeamScore, [Validators.required]),
      awayTeamScore: new FormControl(this.data.prono?.awayTeamScore, [Validators.required]),
    });
  }

  submit() {
    if (this.pronoForm.valid) {
      let prono: IProno = {...this.pronoForm.value, matchId:this.data.id};

      if (this.data.prono) {
        console.log('update');
        prono.id = this.data.prono.id;
        this.pronoService.editProno(prono)
        .then(x => {
          this.data.prono = {...prono};
          this.toastrService.success('Succesvol opgeslagen.');
        })
        .catch(error => {
          console.log(error);
          this.toastrService.error('Er is een fout opgetreden');
        });
      } else {
        console.log('create');
        this.pronoService.createProno(prono)
        .then(x => {
          this.toastrService.success('Succesvol opgeslagen.');
          this.data.prono = {...prono, id: x.id};
        })
        .catch(error => {
          console.log(error);
          this.toastrService.error('Er is een fout opgetreden.');
        });
      }

    }


  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
