import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IMatch } from 'src/app/shared/models/match';
import { EditScoreComponent } from '../edit-score/edit-score.component';

@Component({
  selector: 'app-prono-table',
  templateUrl: './prono-table.component.html',
  styleUrls: ['./prono-table.component.scss']
})
export class PronoTableComponent implements OnInit {
  @Input() matches;
  displayedColumns = ['date','teams', 'score', 'prono', 'points','edit'];
  dateNow = new Date();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openScore(match: IMatch) {
    const dialogRef = this.dialog.open(EditScoreComponent, {
      width: '500px',
      data:match
    });

  }



}
