import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { SpinnerService } from './core/spinner.service';
import { IUser } from './shared/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChild('sidenav') sideNav: MatSidenav;
  user$: Observable<IUser>;

  constructor(private router: Router, private spinner: SpinnerService, private authService: AuthService) {
    this.authService.getAuthState();
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    })
  }
  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
  }

  checkRouterEvent(routerEvent: Event) {
    if (routerEvent instanceof NavigationStart) {
      this.spinner.start();
    }

    if (routerEvent instanceof NavigationEnd
      || routerEvent instanceof NavigationCancel
      || routerEvent instanceof NavigationError) {
        this.spinner.stop();
      }
  }

  logout() {
    this.sideNav.toggle();
    this.authService.logout();
  }
}
