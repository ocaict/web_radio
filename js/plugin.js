import { SplashScreen } from "@capacitor/splash-screen";
import { App } from "@capacitor/app";
import { LocalNotifications } from "@capacitor/local-notifications";

const showNotification = (title, body, timeInSecond) => {
  LocalNotifications.schedule({
    notifications: [
      {
        title,
        body,
        id: 1,
        schedule: { at: new Date(Date.now() + 1000 * timeInSecond) },
        smallIcon: "house",
        iconColor: "#0000FF",
        actions: [
          { id: "yes", title: "Yes" },
          { id: "no", title: "No" },
        ],
      },
    ],
  })
    .then((e) => {
      console.log("Notify Success!");
    })
    .catch((err) => console.log("Error Occured"));
};

export const minimizeApp = () => {
  App.addListener("backButton", () => {
    App.minimizeApp();
    showNotification("Online Radio", "Playing", 0);
  });
};
