import { isProduction } from "../../helpers/isProduction";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

let stompClient: Stomp.Client | null = null;
let isConnected = false;

export async function connectWebSocket() {
  if (!isConnected) {
    if (isProduction()) {
      const socket = new SockJS(
        "https://sopra-fs24-group-34-server.oa.r.appspot.com/ws"
      );
      stompClient = Stomp.over(socket);
    } else {
      const socket = new SockJS("http://localhost:8080/ws");
      stompClient = Stomp.over(socket);
    }

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

export async function makeSubscription(endpoint: string, callback) {
  await waitForConnection();

  if (!stompClient || !stompClient.connected) {
    alert("STOMP client is not connected");
  }

  return stompClient.subscribe(endpoint, callback);
}

export function cancelSubscription(subscription) {
  console.log("stompclient:", stompClient);
  if (stompClient && stompClient.connected && subscription) {
    subscription.unsubscribe();
  }
}

export function sendMessage(destination: string, body: string) {
  if (stompClient && stompClient.connected) {
    stompClient.send(destination, {}, body);
  }
}

export function getStompClient() {
  return stompClient;
}

export async function waitForConnection() {
  while (!stompClient.connected) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
