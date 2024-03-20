import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import firebase from "firebase";
import { FirebaseConfig } from "./helpers/FirebaseConfig";
import configureStore from "./store/index";
import Routes from "./routes/index";
import "antd/dist/antd.css";
import "./styles/index.css";

import registerServiceWorker from "./utils/registerServiceWorker";

// ***** initialize fireBase ***** //
firebase.initializeApp(FirebaseConfig);
const messaging = firebase.messaging();
messaging.requestPermission()
  .then(() => {
    console.log("Have Permission");
    return messaging.getToken();
  })
  .then(token => {
    console.log(token);
  })
  .catch(error => {
    console.log("this is error", error);
  });
messaging.onMessage(function(payload) {
  console.log("onMessage: ", payload);
});

//
// navigator.serviceWorker.register('../firebase-messaging-sw.js')
//   .then((registration) => {
//     messaging.useServiceWorker(registration);
//
//     messaging.requestPermission()
//       .then(() => {
//         //You must return the token
//         console.log("Notification permission granted");
//         return messaging.getToken()
//           .then((currentToken) => {
//             const fcmToken = currentToken;
//             localStorage.fcmToken = fcmToken;
//           })
//           .catch((err) => {
//             console.log("An error occurred while retrieving token.", err);
//           });
//       });
//   })
//   .catch(function(err) {
//   console.log('Service worker registration failed, error:', err);
// });

render(
  <Provider store={configureStore()}>
    <Routes/>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
