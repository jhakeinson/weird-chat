import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  items: Observable<any[]>;
  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService
  ) { 
    this.items = db.list('chats').valueChanges();
    this.items.subscribe(item => {
      console.log(item);
    });
  }

  ngOnInit() {
  }

  logout() {
    this.auth.logOut();
  }

}
