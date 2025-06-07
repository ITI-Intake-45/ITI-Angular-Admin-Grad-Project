import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../models/UserProfile';
import { UserManagementService } from '../../services/UserManagementService';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/MessageService';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  protected message: string | null = null;

  protected users: UserProfile[] = [];

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _userManagementService: UserManagementService) {
  }

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._userManagementService.getAllUsers().subscribe({
      next: response => {
        this.users = response;
      },
      error: err => {
        console.log(err);
      }
    });

  }

}
