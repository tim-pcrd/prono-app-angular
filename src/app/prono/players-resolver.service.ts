import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '../shared/models/user';
import { PronoService } from './prono.service';

@Injectable({ providedIn: 'root' })
export class PlayersResolver implements Resolve<IUser[]> {

  constructor(private pronoService: PronoService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUser[]> | Promise<IUser[]> | IUser[] {
    return this.pronoService.getPlayers();
  }
}
