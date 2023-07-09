import React, { useState, useEffect } from "react";
import { getDevice } from "framework7/lite-bundle";
import { f7, f7ready, App, View } from "framework7-react";
import capacitorApp from "../js/capacitor-app";
import routes from "../js/routes";
import store from "../js/store";
import app from "../js/firebase";

const MyApp = () => {
  // ask permission for local notification

  // local notification

  const device = getDevice();
  const [isUser, setIsUser] = useState(false);
  //  add item to local storage
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", "false");
  }

  // Framework7 Parameters
  const f7params = {
    name: "Project Planner", // App name
    theme: "auto", // Automatic theme detection

    darkMode: false,

    // App store
    store: store,
    // App routes
    routes: routes,

    // Input settings
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    // Capacitor Statusbar settings
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };

  f7ready(() => {
    // Init capacitor APIs (see capacitor-app.js)
    if (f7.device.capacitor) {
      capacitorApp.init(f7);
    }
    // Call F7 APIs here
  });

  return (
    <App {...f7params}>
      {/* Your main view, should have "view-main" class */}
      {console.log(localStorage.getItem("user"))}
      <View
        main
        className="safe-areas"
        url={localStorage.getItem("user") === "true" ? "/" : "/login/"}
      />
      {/* {!localStorage.getItem("user") && (
      )}
      {localStorage.getItem("user") && (
        <View main className="safe-areas" url="/login/" />
      )} */}
    </App>
  );
};
export default MyApp;
