import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)], [this.checkNameNotTaken()]],
      email: ['', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\.)+[\\w-]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },{
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  submit() {
    console.log(this.registerForm);

    if(this.registerForm.valid) {
      const user = this.registerForm.value;
      this.authService.register(user.name, user.email, user.password);
    }
  }

  private mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName]

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value){
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  private checkNameNotTaken(): AsyncValidatorFn {
    return control => {
      return timer(1000).pipe(
        tap(x => console.log(x)),
        switchMap(() => {
          if (!control.value) {
            return of(null)
          }

          return this.authService.checkDisplayName(control.value)
            .pipe(
              map((users: any) => {
                return users.length > 0 ? {nameExists: true} : null;
              })
            )
        })
      )
    }
  }
}
