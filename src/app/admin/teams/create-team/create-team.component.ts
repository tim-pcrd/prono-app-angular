import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Group } from 'src/app/shared/models/team';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit {
  teamForm: FormGroup;
  groups;
  imgURL: any;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.createTeamForm();
  }

  private createTeamForm() {

    this.groups = Group;

    this.teamForm = new FormGroup({
      name: new FormControl('', Validators.required),
      group: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
    });
  }

  getKeys(obj: any) {
    const numberOfKeys =  Object.keys(obj).length;
    return Object.keys(obj).slice(0, numberOfKeys/2);
  }

  imageChange(e) {
    const file = e.target.files[0];
    this.teamForm.get('file').setValue(file);
    var mimeType = file.type;

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  submit(){
    if (this.teamForm.valid) {
      const {file, ...team} = this.teamForm.value;
      this.adminService.createTeam(team, file);
    }
  }
}
