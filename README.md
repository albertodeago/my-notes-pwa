# my-notes-pwa
[Demo](https://my-notes88.firebaseapp.com)
A pwa built with vue, vuetify and firebase. Ispired by Google Keep.
It features "text notes" and "todo notes" and notes can be shared with other users (read only or read and write).
Using firebase every share or modify made on notes will be real time updated to others.

## Todo
- [x] Share notes with other users
- [x] Grand read-only or read and write ability to other users on shares
- [x] Ability to add on home screen on phones
- [x] Banner because we save some cookies
- [ ] Add avatar to users
- [ ] Add a chat between users, or the possibility to comment notes
- [ ] Support push notificaitons
- [ ] Send push notification when an user update one of your notes

## Build Setup

``` bash
# install dependencies
npm install

# connect to your firebase by following instructions inside the file src/config/firebaseConfigSample.js

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
