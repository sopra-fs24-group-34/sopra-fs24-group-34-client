import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { getDomain } from "../../helpers/getDomain";

let stompClient: Stomp.Client | null = null;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
const reconnectDelay = 5000; // 5 seconds
const connectionPoll = 100;

interface SubscriptionInfo {
  endpoint: string;
  callback: Function;
  subscription: Stomp.Subscription | null;
}

const subscriptionsMap = new Map<string, SubscriptionInfo>();

export async function connectWebSocket() {
  if (!isConnected) {
    const domain = getDomain();
    const socket = new SockJS(`${domain}/ws`);

    stompClient = Stomp.over(socket);
    const userId = await localStorage.getItem("userId");
    stompClient.connect({ userId: userId }, onConnect, onError);
  }

  return stompClient;
}

function onConnect() {
  console.log("Connected to WebSocket");
  isConnected = true;
  reconnectAttempts = 0;
}

function onError() {
  console.error("WebSocket connection error. Attempting to reconnect...");

  isConnected = false;

  subscriptionsMap.clear();

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
  if (stompClient !== null && isConnected === true) {
    stompClient.disconnect();
    isConnected = false;
    subscriptionsMap.clear();
  }
}

export async function makeSubscription(endpoint: string, callback: Function) {
  await waitForConnection();

  if (!stompClient || !stompClient.connected) {
    console.error("Couldn't make subscription, STOMP client is not connected");

    return;
  }

  const newSubscription = stompClient.subscribe(endpoint, callback);

  if (subscriptionsMap.has(endpoint)) {
    const oldSubscription = subscriptionsMap.get(endpoint);
    oldSubscription.subscription.unsubscribe();
    console.log("Unsubscribed from old subscription:", oldSubscription.subscription, endpoint);
  }

  subscriptionsMap.set(endpoint, { endpoint, callback, subscription: newSubscription });

  return newSubscription;
}

export async function cancelSubscription(endpoint: string, subscription) {
  if (stompClient && stompClient.connected && subscription) {
    subscriptionsMap.delete(endpoint);

    subscription.unsubscribe();
  }
}

export async function cancelGameSubscriptions() {
  if (stompClient && stompClient.connected) {
    // Filter out subscriptions whose endpoint starts with "/games/"
    const gameSubscriptions = Array.from(subscriptionsMap.entries()).filter(
      ([endpoint, subscriptionInfo]) => endpoint.startsWith("/games/")
    );

    // Unsubscribe and remove each matching subscription
    for (const [endpoint, subscriptionInfo] of gameSubscriptions) {
      if (subscriptionInfo.subscription) {
        subscriptionInfo.subscription.unsubscribe();
        subscriptionsMap.delete(endpoint);
        console.log(`Unsubscribed from ${endpoint}`);
      }
    }
    console.log("Updated subscriptionsMap:", subscriptionsMap);
  }
}

export function sendMessage(destination: string, body: string) {
  if (stompClient && stompClient.connected) {
    stompClient.send(destination, {}, body);
  } else {
    console.error("Couldn't send message, STOMP client is not connected");
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
