// WebSocketComponent.jsx
import React, { useState, useEffect } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const WebSocketComponent = () => {
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    async function ws() {
      const socket = new SockJS("http://localhost:8080/ws"); //ebsocket-demo
      const stompClient = Stomp.over(socket);
      setStompClient(stompClient);

      await stompClient.connect({}, () => {
        console.log("Connected to WebSocket");
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      await stompClient.subscribe("/game/10/receiveMessage", (message) => {
        console.log("Received message from topic /game/10:", message.body);
        // Process the received message as needed
      });

      return () => {
        if (stompClient !== null) {
          stompClient.disconnect();
        }
      };
    }
    ws();
  }, []);

  const sendMessage = () => {

    const message = "Grass is green";
    stompClient.send("/app/sendMessage", {}, JSON.stringify(message));
  };

  return (
    <div>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default WebSocketComponent;
