import { NgModule } from '@angular/core';
import { CommonModule, ɵangular_packages_common_common_a } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HoldableDirective } from './directives/holdable.directive';

@NgModule({
  declarations: [
    HoldableDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatProgressBarModule,
    HoldableDirective
  ],

})
export class SharedModule { }
