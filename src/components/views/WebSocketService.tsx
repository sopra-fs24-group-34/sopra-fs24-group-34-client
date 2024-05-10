import Stomp from "stompjs";
import SockJS from "sockjs-client";

let stompClient: Stomp.Client | null = null;
let isConnected = false;

export function connectWebSocket() {
  if (!isConnected) {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");
      isConnected = true;
    });
  }

  return stompClient;
}

export function disconnectWebSocket() {
  if (stompClient !== null) {
    stompClient.disconnect();
    isConnected = false;
  }
}

export function makeSubscription(endpoint: string, callback) {
  return stompClient.subscribe(endpoint, callback);
}

export function cancelSubscription(subscription) {
  subscription.unsubscribe();
}

export function sendMessage(destination: string, body: string) {
  stompClient.send(destination, {}, body);
}

export function getStompClient() {
  return stompClient;
}
