import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IMatch } from 'src/app/shared/models/match';
import { AdminService } from '../admin.service';

@Injectable({ providedIn: 'root' })
export class MatchesResolver implements Resolve<IMatch[]> {

  constructor(private adminService: AdminService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMatch[]> | Promise<IMatch[]> | IMatch[] {
    return this.adminService.getAllMatches();
  }
}
