import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProno } from 'src/app/shared/models/prono';
import { IUser } from 'src/app/shared/models/user';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { RankingDetailsComponent } from './ranking-details/ranking-details.component';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  ranking: {player: IUser, points: number, fivePointers: number, twoPointers: number, onePointers: number}[] = [];
  displayedColumns = ['position', 'name', 'points'];

  constructor(private route: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    const pronos: IProno[] = this.route.snapshot.data['pronos'];
    const players: IUser[] = this.route.snapshot.data['players'];

    const grouping = _.groupBy(pronos, 'userId');
    let _ranking = [];
    for(const [key, value] of Object.entries(grouping)){
      const fivePointers = (value as IProno[]).filter(x => x.points === 5).length;
      const twoPointers = (value as IProno[]).filter(x => x.points === 2).length;
      const onePointers = (value as IProno[]).filter(x => x.points === 1).length;
      let points = _.sumBy(value, 'points');
      _ranking.push({player: players.find(x => x.id == key), points, fivePointers, twoPointers, onePointers});
    }
    this.ranking = _.orderBy(_ranking, ['points', 'fivePointers', 'twoPointers'], ['desc', 'desc', 'desc']);

  }

  openDetails(ranking: any) {
    const dialogRef = this.dialog.open(RankingDetailsComponent, {
      width: '500px',
      data:ranking,
      backdropClass: 'dialog-background'
    });
  }

}
