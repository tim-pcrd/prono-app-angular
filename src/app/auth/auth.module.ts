import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {MatDialogModule} from '@angular/material/dialog';
import { SendEmailComponent } from './send-email/send-email.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    SendEmailComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    MatDialogModule
  ]
})
export class AuthModule { }
