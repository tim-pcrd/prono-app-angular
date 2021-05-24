import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMatch } from 'src/app/shared/models/match';

@Component({
  selector: 'app-edit-score',
  templateUrl: './edit-score.component.html',
  styleUrls: ['./edit-score.component.scss']
})
export class EditScoreComponent implements OnInit {
  pronoForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditScoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMatch) { }

  ngOnInit(): void {
    this.createPronoForm();
    console.log(new Date())
    console.log(this.data.date);
  }

  createPronoForm() {
    this.pronoForm = new FormGroup({
      homeTeamScore: new FormControl('', [Validators.required]),
      awayTeamScore: new FormControl('', [Validators.required]),
    });
  }

  submit() {

  }

}
