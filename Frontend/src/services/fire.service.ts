import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app'
import { MatSnackBar} from "@angular/material/snack-bar";
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

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
  storage: firebase.storage.Storage;
  currentSignedInUserAvatarURL: string = "https://cdn-icons-png.flaticon.com/512/149/149071.png?w=740&t=st=1686927983~exp=1686928583~hmac=06f646a94b6cf1b5fe2f62b7aecdb82ac8270c5780f7bebc4efb15626d2c129f";

  constructor(public snack: MatSnackBar) {
    this.firebaseApplication = firebase.initializeApp(config.firebaseconfig)
    this.firestore = firebase.firestore();
    this.fireauth = firebase.auth();
    this.storage = firebase.storage();

    this.fireauth.onAuthStateChanged((user) =>
    {
      if(user)
      {
        this.getMessages()
        this.getImageOfSignedInUser()
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
        console.log(error.message)
      })
  }

  register(email: string, password: string): void {
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .catch(error => {
        this.snack.open(error.message, 'Close');
        this.lastError = error.code;
        console.log(error.message)
      })
  }

  signOut()
  {
    this.fireauth.signOut()
    this.currentSignedInUserAvatarURL = "https://cdn-icons-png.flaticon.com/512/149/149071.png?w=740&t=st=1686927983~exp=1686928583~hmac=06f646a94b6cf1b5fe2f62b7aecdb82ac8270c5780f7bebc4efb15626d2c129f";

  }

  async  getImageOfSignedInUser(): Promise<void>
  {
    this.currentSignedInUserAvatarURL = await this.storage
      .ref('avatars')
      .child(this.fireauth.currentUser?.uid + "")
      .getDownloadURL()
  }

  async updateUserImage($event): Promise<void> {
    const image = $event.target.files[0];
    const uploadTask = await this.storage
      .ref('avatars')
      .child(this.fireauth.currentUser?.uid + "")
      .put(image);
    this.currentSignedInUserAvatarURL = await uploadTask.ref.getDownloadURL();
  }
}

export interface MessageDTO{
  messageContent: string
  timeStamp: Date;
  user: string;
}
