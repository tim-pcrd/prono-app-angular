import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProno } from 'src/app/shared/models/prono';
import { IUser } from 'src/app/shared/models/user';
import { PronoService } from '../prono.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  constructor(private pronoService: PronoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const pronos: IProno[] = this.route.snapshot.data['pronos'];
    const players: IUser[] = this.route.snapshot.data['players'];
    console.log(pronos);
    console.log(players);

    const ranking = _.groupBy(pronos, 'userId');
    console.log(ranking);


  }

}
