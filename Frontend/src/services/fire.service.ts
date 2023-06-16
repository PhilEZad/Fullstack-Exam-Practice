import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app'
import { MatSnackBar} from "@angular/material/snack-bar";
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import * as config from '../../firebaseconfig.js'

@Injectable({
  providedIn: 'root'
})
export class FireService {

  lastError: string = "";
  firebaseApplication;
  firestore: firebase.firestore.Firestore;
  fireauth: firebase.auth.Auth;
  messages: any[] = [];

  constructor(public snack: MatSnackBar) {
    this.firebaseApplication = firebase.initializeApp(config.firebaseconfig)
    this.firestore = firebase.firestore();
    this.fireauth = firebase.auth();

    this.fireauth.onAuthStateChanged((user) =>
    {
      if(user)
      {
        this.getMessages()
      }
    })
  }


  sendMessage(sendThisMessage: any) {
    let messageDTO: MessageDTO =
      {
        messageContent: sendThisMessage,
        timeStamp: new Date(),
        user: 'some user'
      }
    this.firestore
      .collection('myChat')
      .add(messageDTO)
  }

 getMessages(): void {
    this.firestore
      .collection('myChat')
      .orderBy('timeStamp')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change =>
        {
          if (change.type == 'added')
          {
            this.messages.push({id: change.doc.id, data: change.doc.data()})
          } (change.type == 'modified')
          {
            const index = this.messages.findIndex(document => document.id != change.doc.id)
            this.messages[index] =
            {
              id: change.doc.id, data: change.doc.data()
            }
          } if (change.type == 'removed')
          {
            this.messages = this.messages.filter(m => m.id != change.doc.id)
          }
        })
      })
  }

  signIn(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.snack.open(error.message, 'Close')
        this.lastError = error.code;
        console.log(error.message())
      })
  }

  register(email: string, password: string): void {
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .catch(error => {
        this.snack.open(error.message, 'Close');
        this.lastError = error.code;
        console.log(error.message())
      })
  }

  signOut()
  {
    this.fireauth.signOut()
  }
}

export interface MessageDTO{
  messageContent: string
  timeStamp: Date;
  user: string;
}
