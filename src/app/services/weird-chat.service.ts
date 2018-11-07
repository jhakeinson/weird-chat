import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable, ObjectUnsubscribedError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeirdChatService {
  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase
  ) {}

  getActiveUser() {
    let uid = this.auth.currentUserId;
    return this.db.object("/users/" + uid).valueChanges();
  }

  getChats() {
    return this.db.list('/chats').valueChanges();
  }

  getChat(slug: string) {
    return new Observable(observer => {
      this.db.object('/chats').query.orderByChild('slug').equalTo(slug)
        .once('value')
        .then(snapshot => {
          snapshot.forEach(chat => {
            observer.next( chat.exportVal() );
          });

          observer.complete();
        }).catch(error => {
          observer.error(error);
        });

      return () => {
        observer.unsubscribe();
      };
    });
  }

  getChatMessages(slug: string) {
    return new Observable(observer => {
      this.getChat(slug).subscribe(chat => {
        this.db.list('/messages/' + chat._id).valueChanges()
          .subscribe(msgs => {
            let messages = msgs.map(msg => {
              this.db.object('/users/' + msg.userId).valueChanges()
                .subscribe(user => {
                  msg.user = user;

                  this.getActiveUser().subscribe(user => {
                    msg.isOwnedByActiveUser = msg.user._id === user._id;
                  });
                });

              return msg;
            });

            observer.next(messages);

          }, error => {
            observer.error(error)
          }, () => {
            observer.complete()
          });
      });

      return () => {
        observer.unsubscribe()
      };
    });
  }

  saveChatMessage(messageData: object, chatSlug: string) {
    let chatId: any;
    this.getChat(chatSlug).subscribe(chat => {
      chatId = chat._id;
    }, error => { 
      console.log(error);
    }, () => {
      this.db.list('/messages/' + chatId).push(messageData);
    });
  }
}
