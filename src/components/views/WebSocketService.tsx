import { isProduction } from "../../helpers/isProduction";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

let stompClient: Stomp.Client | null = null;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
const reconnectDelay = 5000; // 5 seconds
const connectionPoll = 100;

//const subscriptionsMap = new Map();
//const subscriptionsMap = new Map(JSON.parse(localStorage.getItem('subscriptionsMap')) || []);

interface SubscriptionInfo {
  endpoint: string;
  callback: Function;
  subscription: Stomp.Subscription | null;
}
//const subscriptionsMap = new Map<string, SubscriptionInfo>(JSON.parse(localStorage.getItem("subscriptionsMap")) || []);

function loadSubscriptionsFromLocalStorage(): Map<string, SubscriptionInfo> {
  const storedSubscriptions = localStorage.getItem("subscriptionsMap");
  if (storedSubscriptions) {
    const parsedSubscriptions = JSON.parse(storedSubscriptions);
    console.log("Fetching subscriptions: ", storedSubscriptions);

    return new Map<string, SubscriptionInfo>(parsedSubscriptions);
  }

  return new Map<string, SubscriptionInfo>();
}

function saveSubscriptionsToLocalStorage() {
  localStorage.setItem(
    "subscriptionsMap",
    JSON.stringify(Array.from(subscriptionsMap.entries()))
  );
}

const subscriptionsMap = loadSubscriptionsFromLocalStorage();

export async function connectWebSocket() {
  if (!isConnected) {
    const socket = new SockJS(
      isProduction()
        ? "https://sopra-fs24-group-34-server.oa.r.appspot.com/ws"
        : "http://localhost:8080/ws"
    );

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

  /*
  // Resubscribe to all previous subscriptions
  subscriptionsMap.forEach((subscriptionInfo, endpoint) => {
    console.log("Trying to resubscribe: ", subscriptionInfo);
    //if (subscriptionInfo.endpoint && subscriptionInfo.callback) {
      const reSubscription = stompClient.subscribe(subscriptionInfo.endpoint, subscriptionInfo.callback);
      subscriptionInfo.subscription = reSubscription;
      console.log("RESUBSCRIBED: ", reSubscription);
    //}
  });
  saveSubscriptionsToLocalStorage();
  */
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
    localStorage.removeItem("subscriptionsMap");
  }
}

export async function makeSubscription(endpoint: string, callback: Function) {
  await waitForConnection();

  if (!stompClient || !stompClient.connected) {
    alert("STOMP client is not connected");
    return;
  }

  //if (!subscriptionsMap.has(endpoint) || !subscriptionsMap.get(endpoint).subscription) {
    const subscription = stompClient.subscribe(endpoint, callback);
    subscriptionsMap.set(endpoint, { endpoint, callback, subscription });
    /*
    subscriptionsMap.set(subscription.id, subscription);
    localStorage.setItem("subscriptionsMap", JSON.stringify(Array.from(subscriptionsMap.entries())));
    */
    saveSubscriptionsToLocalStorage();

    console.log("New stomp:", stompClient);
    console.log("New sub:", subscription, endpoint);
    console.log("NEW submap:", subscriptionsMap);
    return subscription;
  //} else {
  //  console.log("Subscription already exists in subscriptionsMap");
  //}
}

export async function cancelSubscription(endpoint: string, subscription) {
  if (stompClient && stompClient.connected && subscription) {
    /*
    await subscriptionsMap.delete(subscription.id);
    localStorage.setItem("subscriptionsMap", JSON.stringify(Array.from(subscriptionsMap.entries())));
    */
   
    subscriptionsMap.delete(endpoint);
    saveSubscriptionsToLocalStorage();

    subscription.unsubscribe();
    console.log("deleted from submap:", subscriptionsMap);
  }
}

export async function cancelGameSubscriptions() {
  if (!stompClient || !stompClient.connected) {
    console.error("STOMP client is not connected");
    return;
  }

  // Filter out subscriptions whose endpoint starts with "/games/"
  const gameSubscriptions = Array.from(subscriptionsMap.entries()).filter(([endpoint, subscriptionInfo]) =>
    endpoint.startsWith("/games/")
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

  // Save the updated subscriptionsMap to localStorage
  saveSubscriptionsToLocalStorage();
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
