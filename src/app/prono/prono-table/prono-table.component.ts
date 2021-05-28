import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IMatch } from 'src/app/shared/models/match';
import { EditScoreComponent } from '../edit-score/edit-score.component';
import { PronoDetailsComponent } from '../prono-details/prono-details.component';

@Component({
  selector: 'app-prono-table',
  templateUrl: './prono-table.component.html',
  styleUrls: ['./prono-table.component.scss']
})
export class PronoTableComponent implements OnInit {
  @Input() matches;
  displayedColumns = ['date','teams', 'prono','score',  'points','edit'];
  displayedColumnsSmall = ['all'];
  dateNow = new Date();

  constructor(private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
  }

  openScore(match: IMatch) {
    const dialogRef = this.dialog.open(EditScoreComponent, {
      width: '500px',
      data:match
    });

  }


  openDetails(match: IMatch) {
    const dialogRef = this.dialog.open(PronoDetailsComponent, {
      width: '500px',
      data: match
    })
  }

  onOpenClick(match: IMatch) {
    if(match.prono?.points > -1){
      this.openDetails(match);
    } else if(match.date > new Date()) {
      this.openScore(match);
    }
  }


}
