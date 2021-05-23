import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {
  emailForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.createEmailForm();
  }

  createEmailForm() {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\.)+[\\w-]{2,4}$')])
    })
  }

  submit() {
    if (this.emailForm.valid) {
      this.authService.resetPassword(this.emailForm.value.email);
    }
  }

}
