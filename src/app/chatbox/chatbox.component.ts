import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { WeirdChatService } from '../services/weird-chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  activeUser: any;
  chats: any;
  currentChat: string = '';
  chatMessages: any;

  msgInput = new FormControl('');

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService,
    private wc: WeirdChatService,
    private router: Router,
    private ar: ActivatedRoute
  ) { }

  ngOnInit() {
    this.wc.getActiveUser().subscribe(user => {
      this.activeUser = user;
    });

    this.wc.getChats().subscribe(chats => {
      this.chats = chats;
    });

    this.ar.params.subscribe(param => {
      if(!param.chatTitle) {
        this.router.navigate(['/chat', 'general-chat']);
      } else {
        this.currentChat = param.chatTitle;
        this.wc.getChatMessages(this.currentChat).subscribe(msgs => {
          this.chatMessages = msgs;
        });
      }
    });
  }add 

  sendMessage() {
    let msg = this.msgInput.value;
    if(msg) {
      let msgData = {
        message: msg,
        timestamp: + new Date(),
        userId: this.activeUser._id
      };
      this.wc.saveChatMessage(msgData, this.currentChat);
      this.msgInput.setValue('');
    }
  }

  logout() {
    this.auth.logOut();
  }
}
