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

  getPoints(match: IMatch) {
    if (
      match.homeTeamScore && match.awayTeamScore
      && match.prono.homeTeamScore && match.prono.awayTeamScore) {
        const ht = match.homeTeamScore;
        const at = match.awayTeamScore;
        const pht = match.prono.homeTeamScore;
        const pat = match.prono.awayTeamScore;

        if ((ht === pht) && (at === pat)) {
          return 5;
        }

        if((ht === 0) && (at === 0) && (ht > 0) && (at > 0) && (ht-at === 0)) {
          return 1;
        }


        if ((ht - at) === (pht - pat)) {
          return 3;
        }

        if (((ht-at > 1) && (pht - pat > 1)) || ((ht-at < -1) && (pht - pat < -1))) {
          return 3;
        }

        if (((ht-at >= 1) && (pht - pat >= 1)) || ((ht-at <= -1) && (pht - pat <= -1))) {
          return 1;
        }

        return 0;
    }
  }



}
