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
  send_from: string;
  file?: string;
}

const ChatBoard = (user_id: { user_id?: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [socketIdFromLocal, setSocketIdFromLocal] = useState("");
  const userId = "10"; // Your user ID

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        send_to: "10",
        message: newMessage,
        send_from: socket?.id,
      };

      socket.emit("privetMessage", messageData);
      // Update local messages
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          send_from: socket?.id!,
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
          send_from: socket?.id!,
          file: URL.createObjectURL(file),
        },
      ]);
    }
  };

  // implement socket start

  useEffect(() => {
    console.log(
      `process.env.NEXT_PUBLIC_NEXT_PUBLIC_SOCKET = ${process.env.NEXT_PUBLIC_SOCKET}`
    );
    // Initialize socket connection
    const socketInstance = io(`${process.env.NEXT_PUBLIC_SOCKET}`, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      const socketId = localStorage.getItem("socket_id");
      if (!socketId && socketInstance?.id) {
        socketInstance.emit("sendSocketId", {socketId: socketInstance?.id, role: 'user'});
        localStorage.setItem(`socket_id`, socketInstance?.id);
      }
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
      // socket.current.emit('join', userId);
      socket.emit("join", "10");

      socket.on(socket?.id, (messageData) => {
        console.log("listen message", messageData);

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: messageData.message,
            send_from: messageData.from,
          },
        ]);
      });
    }
  }, [socket?.id]);

  useEffect(() => {
    if (socket?.id) {
      const socketIdFromLocalStorage = localStorage.getItem("socket_id");
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
              message.send_from === socket?.id ? "justify-end" : "justify-start"
            }`}
          >
            {/* Add the logo if the message is from another sender */}
            {message.send_from !== socket?.id && (
              <Image
                src={logo}
                alt="Kotha Logo"
                className="w-8 h-8 mr-4 rounded-full" // Increased margin-right for more space
                width={32}
                height={32}
              />
            )}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                message.send_from === socket?.id
                  ? "bg-gray-200 text-black"
                  : "bg-custom-green text-white"
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
