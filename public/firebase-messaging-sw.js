importScripts("https://www.gstatic.com/firebasejs/4.12.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.12.0/firebase-messaging.js");
// let config = {
//   messagingSenderId: "107381916793"
// };
import { FirebaseConfig } from "../src/helpers/FirebaseConfig";

firebase.initializeApp(FirebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(payload => {
  const title = payload.data.title;
  // console.log('payload', payload.notification.icon);
  const options = {
    body: payload.data.content
    // icon: payload.notification.icon
  };
  return self.registration.showNotification(title, options);
});
