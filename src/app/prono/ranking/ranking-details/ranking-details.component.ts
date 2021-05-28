import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMatch } from 'src/app/shared/models/match';
import { EditScoreComponent } from '../../edit-score/edit-score.component';

@Component({
  selector: 'app-ranking-details',
  templateUrl: './ranking-details.component.html',
  styleUrls: ['./ranking-details.component.scss']
})
export class RankingDetailsComponent implements OnInit {


  constructor(
    private dialogRef: MatDialogRef<EditScoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
  }

}
