import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import * as config from '../../firebaseconfig.js'

@Injectable({
  providedIn: 'root'
})
export class FireService {

  firebaseApplication;
  firestore: firebase.firestore.Firestore;
  fireauth: firebase.auth.Auth;
  messages: any[] = [];

  constructor() {
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

  register(email: string, password: string): void
  {
    this.fireauth.createUserWithEmailAndPassword(email, password)
  }

  signIn(email: string, password: string)
  {
    this.fireauth.signInWithEmailAndPassword(email, password)
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
