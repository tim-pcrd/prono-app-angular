import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  requestCount = 0;

  constructor(private spinner: NgxSpinnerService) { }

  start() {
    this.requestCount++;
    this.spinner.show(undefined, {
      type: 'ball-triangle-path',
      bdColor: 'rgba(0,0,0,0.8)'
    });
  }

  stop() {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.spinner.hide();
    }
  }
}
