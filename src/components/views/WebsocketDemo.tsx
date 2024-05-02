// WebSocketComponent.jsx
import React, { useState, useEffect } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

const WebSocketComponent = () => {
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws"); //ebsocket-demo
    const stompClient = Stomp.over(socket);
    setStompClient(stompClient);

    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");
    });

    return () => {
      if (stompClient !== null) {
        stompClient.disconnect();
      }
    };
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
