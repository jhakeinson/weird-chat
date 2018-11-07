import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'chat-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @Input() messages: any;

  constructor() { }

  ngOnInit() { }
}
