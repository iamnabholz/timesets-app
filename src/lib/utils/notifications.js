const sound = '/completed.wav';

export function playSound() {
  const audio = new Audio(sound);

  if(JSON.parse(localStorage.getItem("sound")) === true){
    audio.play();
  }
}


function isDenied() {
  return (
    Notification.permission === "denied" ||
    Notification.permission === "default"
  );
}

function show(title, body) {
  if (JSON.parse(localStorage.getItem("notifications"))) {
    var notification = new Notification(
        title || "Notifications have been enabled", {
            body: body || "Now you will be notified when a timer has finished",
            icon: "/android-chrome-512x512.png",
            silent: true
        }
    );
    notification.onclick = function () {
        window.focus();
    };
}
}

export function showNotification(notificationTitle, notificationBody) {
  if('Notification' in window)
  {
    if (isDenied()) {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          localStorage.setItem("notifications", "true");
          show(notificationTitle, notificationBody);
        } else {
          localStorage.setItem("notifications", "false");
        }
      });
    } else {
      show(notificationTitle, notificationBody);
    }
  }
}