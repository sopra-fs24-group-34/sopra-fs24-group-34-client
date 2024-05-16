import { isProduction } from "../../helpers/isProduction";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

let stompClient: Stomp.Client | null = null;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
const reconnectDelay = 5000; // 5 seconds
const connectionPoll = 100;

const subscriptionsMap = new Map();

export async function connectWebSocket() {
  if (!isConnected) {
    const socket = new SockJS(
      isProduction()
        ? "https://sopra-fs24-group-34-server.oa.r.appspot.com/ws"
        : "http://localhost:8080/ws"
    );

    stompClient = Stomp.over(socket);
    const userId = await localStorage.getItem("userId");
    stompClient.connect({userId: userId}, onConnect, onError);
  }

  return stompClient;
}

function onConnect() {
  console.log("Connected to WebSocket");
  isConnected = true;
  reconnectAttempts = 0;

  // Resubscribe to all previous subscriptions
  subscriptionsMap.forEach((subscription/*endpoint, callback*/) => {
    makeSubscription(subscription.endpoint, subscription.callback/*endpoint, callback*/);
  });
}

function onError() {
  console.error("WebSocket connection error. Attempting to reconnect...");

  isConnected = false;

  if (reconnectAttempts < maxReconnectAttempts) {
    setTimeout(() => {
      reconnectAttempts++;
      connectWebSocket();
    }, reconnectDelay);
  } else {
    console.error("Max WebSocket-reconnect attempts reached");
  }
}

export function disconnectWebSocket() {
  if (stompClient !== null) {
    stompClient.disconnect();
    isConnected = false;
    subscriptionsMap.clear();
  }
}

export async function makeSubscription(endpoint: string, callback) {
  await waitForConnection();

  if (!stompClient || !stompClient.connected) {
    alert("STOMP client is not connected");
  }

  const subscription = stompClient.subscribe(endpoint, callback);
  subscriptionsMap.set(subscription.id, subscription/*endpoint, callback*/);
  console.log("New stomp:", stompClient);
  console.log("New sub:", subscription);
  console.log("NEW submap:", subscriptionsMap);
  return subscription;
}

export async function cancelSubscription(subscription) {
  if (stompClient && stompClient.connected && subscription) {
    await subscriptionsMap.delete(subscription.id);
    subscription.unsubscribe();
    console.log("deleted from submap:", subscriptionsMap);
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
  while (!stompClient || !stompClient.connected) {
    await new Promise((resolve) => setTimeout(resolve, connectionPoll));
  }
}
