import { Component, OnInit } from '@angular/core';
import { Group } from '../shared/models/team';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {

  }

  addTeam() {

  }

}
