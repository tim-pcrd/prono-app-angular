import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IProno } from '../shared/models/prono';
import { PronoService } from './prono.service';

@Injectable({ providedIn: 'root' })
export class PronoResolver implements Resolve<IProno[]> {

  constructor(private pronoService: PronoService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProno[]> | Promise<IProno[]> | IProno[] {
    return;
  }
}
