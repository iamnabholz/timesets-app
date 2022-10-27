const done = '/sounds/timer-done.wav';
const lap = '/sounds/new-lap.wav';

export function playSound(soundToPlay) {

  if (soundToPlay === "done") {
    const audio = new Audio(done);

    if (JSON.parse(localStorage.getItem("timerSound")) === true) {
      audio.play();
    }
  } else if (soundToPlay === "lap") {
    const audio = new Audio(lap);

    if (JSON.parse(localStorage.getItem("lapSound")) === true) {
      audio.play();
    }
  }
}

function show(title, body) {
  const notification = new Notification(
    title || "Notifications are enabled", {
    body: body || "Now you will be notified when a timer has finished",
    icon: "/icons/icon-512.png",
    silent: true
  }
  );
  notification.onclick = () => {
    window.focus();
  };
}

export function showNotification(notificationTitle, notificationBody) {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    console.log("This platform doesn't support the Notification API");
  } else if (Notification.permission === "granted") {
    if (localStorage.getItem("notitifications") === "true") {
      show(notificationTitle, notificationBody);
    }
  }
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        localStorage.setItem("notifications", "true");
        show(notificationTitle, notificationBody);
      } else {
        localStorage.setItem("notifications", "false");
      }
    });
  }
}