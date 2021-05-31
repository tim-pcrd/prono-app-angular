import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../admin/admin.service';
import { IUser } from '../shared/models/user';

@Injectable({ providedIn: 'root' })
export class PlayersResolver implements Resolve<IUser[]> {

  constructor(private adminService: AdminService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUser[]> | Promise<IUser[]> | IUser[] {
    return this.adminService.getPlayers();
  }
}
