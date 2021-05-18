import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ITeam } from 'src/app/shared/models/team';
import { AdminService } from '../admin.service';

@Injectable({ providedIn: 'root' })
export class TeamsResolver implements Resolve<ITeam[]> {
  constructor(private adminService: AdminService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITeam[]> | Promise<ITeam[]> | ITeam[] {
    return this.adminService.getAllTeams();
  }
}
