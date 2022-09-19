//const sound = '/assets/now-sound.mp3';

export function playSound() {
    //const audio = new Audio(sound);
    //audio.play();
}

export function showNotification(notificationTitle, notificationBody) {
    if ('Notification' in window) {
        var notification = new Notification(
            notificationTitle || "Notifications have been enabled", {
                body: notificationBody || "Now you will be notified when a timer has finished",
                icon: "/android-chrome-512x512.png",
                silent: true
            }
        );
        notification.onclick = function () {
            window.focus();
        };
    }
}