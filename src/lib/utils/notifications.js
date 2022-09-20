const done = '/sounds/timer-done.wav';
const lap = '/sounds/new-lap.wav';

export function playSound(soundToPlay) {

  if(soundToPlay === "done")
  {
    const audio = new Audio(done);
  
    if(JSON.parse(localStorage.getItem("timerSound")) === true){
      audio.play();
    }
  } else if(soundToPlay === "lap") 
  {
    const audio = new Audio(lap);
    
    if(JSON.parse(localStorage.getItem("lapSound")) === true){
      audio.play();
    }
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
            icon: "/icons/icon-512.png",
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