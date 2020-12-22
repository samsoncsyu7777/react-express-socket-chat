import { useRef } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "";

const MySocket = () => {
  const socketRef = useRef();

  const connectSocket = (roomId, userId, username, setMessages, messages, setUnreadZero, setOnlineUsernamesList) => {

    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId, userId, username }, transports: ['polling']
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        messageString: message.data.message,
        updatedAt: new Date().toISOString(),
        userId: message.data.userId
      };
      setMessages((messages) => [...messages, incomingMessage]);
      setUnreadZero();
    });

    socketRef.current.on('broadcast', (broadcastMessage) => {
      if ("onlineUsers" in broadcastMessage) {
        setOnlineUsernamesList(broadcastMessage.onlineUsers);
      }
    });
  
    return () => {
      socketRef.current.disconnect();
    };
  };

  const sendMessage = (messageBody, userId) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      message: messageBody,
      userId: userId,
    });
  };

  const disconnect = () => {
    socketRef.current.disconnect();
  };

  return { connectSocket, sendMessage, disconnect };
};

export default MySocket;