importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBXVgVFWHqOk_WISvnibxULNEKqnzROBpQ",
  authDomain: "nilo-limps.firebaseapp.com",
  projectId: "nilo-limps",
  storageBucket: "nilo-limps.firebasestorage.app",
  messagingSenderId: "896378320138",
  appId: "1:896378320138:web:1c37d32a76ce7344bcf6f3",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "Pedidos Nilo", {
    body: body || "",
    icon: "/icon-192.png",
  });
});
