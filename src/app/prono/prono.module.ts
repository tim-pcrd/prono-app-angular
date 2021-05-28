import { NgModule } from '@angular/core';
import { PronoComponent } from './prono.component';
import { SharedModule } from '../shared/shared.module';
import {MatTabsModule} from '@angular/material/tabs';
import { PronoRoutingModule } from './prono-routing.module';
import { PronoTableComponent } from './prono-table/prono-table.component';
import { EditScoreComponent } from './edit-score/edit-score.component';
import {MatDialogModule} from '@angular/material/dialog';
import { RankingComponent } from './ranking/ranking.component';
import { RankingDetailsComponent } from './ranking/ranking-details/ranking-details.component';



@NgModule({
  declarations: [
    PronoComponent,
    PronoTableComponent,
    EditScoreComponent,
    RankingComponent,
    RankingDetailsComponent
  ],
  imports: [
    SharedModule,
    PronoRoutingModule,
    MatTabsModule,
    MatDialogModule
  ]
})
export class PronoModule { }
