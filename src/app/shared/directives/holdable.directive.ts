import { EventEmitter, HostListener } from '@angular/core';
import { Directive, Output } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[holdable]'
})
export class HoldableDirective {
  @Output() holdTime: EventEmitter<number> = new EventEmitter();
  state: Subject<string> = new Subject();
  cancel: Observable<string>;

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  @HostListener('touchend', ['$event'])
  onExit() {
    this.state.next('cancel');
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onHold() {
    console.log('%c started hold', 'color: #5fba7d; font-weight: bold;');
    this.state.next('start');

    const n = 100;

    interval(n).pipe(
      takeUntil(this.cancel),
      tap(v => {
        this.holdTime.emit(v*n);
        
      })
    )
    .subscribe();
  }

  constructor() {
    this.cancel = this.state.pipe(
      filter(v => v === 'cancel'),
      tap(v => {
        console.log('%c stopped hold', 'color: #ec6969; font-weight: bold;');
        this.holdTime.emit(0);
      }));
   }

}
