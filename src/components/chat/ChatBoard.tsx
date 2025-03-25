"use client";

import { useState, useRef, type ChangeEvent, useEffect, use } from "react";
import { Paperclip } from "lucide-react";
import { io, Socket } from "socket.io-client";
import logo from "@/../logo/kotha.svg";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface Message {
  id: number;
  text: string;
  socket_id: string;
  file?: string;
}

const ChatBoard = (user_id: { user_id?: number }) => {
  const [messages, setMessages] = useState<Message[]>([
    // { id: 1, text: "1", socket_id: "test" },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [socketIdFromLocal, setSocketIdFromLocal] = useState("");
  const [idForMessage, setIdForMessage] = useState("100");
  const [clientId, setClientId] = useState("");

  // const [audio] = useState(new Audio('/vibrating-message-37619.mp3'));
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAudio(new Audio("/vibrating-message-37619.mp3"));
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const client_id = localStorage.getItem("client_id");
    if (!client_id) console.log("please reload!");
    if (newMessage.trim() && socket) {
      const messageData = {
        send_to_socket_id: idForMessage,
        send_to: idForMessage,
        message: newMessage,
        socket_id: socket?.id,
        first_message: messages?.length ? false : true,
        client_id: client_id,
      };
      console.log("message daata", messageData);
      socket.emit("message", messageData);
      // Update local messages
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          socket_id: socket?.id!,
        },
      ]);

      setNewMessage("");
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file to a server here
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: `File: ${file.name}`,
          socket_id: socket?.id!,
          file: URL.createObjectURL(file),
        },
      ]);
    }
  };

  useEffect(() => {

    // Initialize socket connection with client_id in query params if available
    const socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL_ROOT}`);

    socketInstance.on("connect", () => {
      setIsConnected(true);

      // Get or create client_id
      const client_id = localStorage.getItem("client_id") || socketInstance.id;
      console.log("client id", client_id);
      setClientId(client_id!);
      // Store it if it's new
      if (!localStorage.getItem("client_id")) {
        localStorage.setItem("client_id", client_id!);
      }

      // Always send this ID to the server after connection
      socketInstance.emit("sendSocketId", {
        client_id: client_id,
        role: "user",
      });

      // Join a room with this client_id for direct messaging
      socketInstance.emit("join", client_id);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket?.id) {
      // socket.current.emit('join', idForMessage);
      const client_id = localStorage.getItem("client_id");
      socket.emit("join", idForMessage);
    
      const messageHandler = (messageData: any) => {
        if (audio) {
          audio
            .play()
            .catch((error) => console.log("Audio playback failed:", error));
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: messageData.message,
            socket_id: messageData.from,
          },
        ]);
      };
      socket.on(clientId, messageHandler);

      return () => {
        socket.off(clientId!, messageHandler);
      };
    }
  }, [socket?.id, clientId]);

  useEffect(() => {
    if (socket?.id) {
      const socketIdFromLocalStorage = localStorage.getItem("client_id");
      if (socketIdFromLocalStorage) {
        setSocketIdFromLocal(socketIdFromLocalStorage);
      }
    }
  }, [socket?.id]);

  // implement socket end

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-center ${
              message.socket_id === socket?.id ? "justify-end" : "justify-start"
            }`}
          >
            {/* Add the logo if the message is from another sender */}
            {message.socket_id !== socket?.id && (
              <Image
                src={logo}
                alt="Kotha Logo"
                className="w-8 h-8 mr-4 rounded-full" // Increased margin-right for more space
                width={32}
                height={32}
              />
            )}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-xl p-2 ${
                message.socket_id === socket?.id
                  ? "bg-custom-green text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p>{message.text}</p>
              {message.file && (
                <img
                  src={message.file || "/placeholder.svg"}
                  alt="Uploaded file"
                  className="mt-2 max-w-full h-auto"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white flex items-center"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type here and press enter.."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-green"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 transition-colors duration-200 "
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {/* <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-200"
        >
          <Send className="w-5 h-5" />
        </button> */}
      </form>
    </div>
  );
};

export default ChatBoard;
