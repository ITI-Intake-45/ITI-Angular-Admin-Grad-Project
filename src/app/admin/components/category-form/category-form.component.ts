import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/MessageService';

@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent implements OnInit {
  protected message: string | null = null;

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService) {
  }

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);
  }


}
