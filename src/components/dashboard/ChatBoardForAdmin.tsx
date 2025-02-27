"use client";

import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { getMessages } from "@/actions/actions";
import useUser from "@/hook/useUser";

interface Message {
  id: number;
  text: string;
  send_from: string;
  send_to?: string;
  file?: string;
}

const ChatBoardForAdmin = () => {
  const soundFile = "/vibrating-message-37619.mp3";
  const [messages, setMessages] = useState<Message[]>([]);
  const [send_to, setSendTo] = useState<string>("t1P2bxvSTQdjOT9sAAAp");
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  // const [play, { stop }] = useSound("/vibrating-message-37619.mp3");
  const [audio] = useState(new Audio("/vibrating-message-37619.mp3"));


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        send_to: send_to,
        message: newMessage,
        send_from: "10",
      };
      socket.emit("privetMessage", messageData);

      // Update local messages
      setMessages([
        ...messages,
        {
          id: messages.length + 10000,
          text: newMessage,
          send_from: "10",
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
          send_from: "user",
          file: URL.createObjectURL(file),
        },
      ]);
    }
  };


  // implement socket start
  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(`${process.env.NEXT_PUBLIC_SOCKET}`, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
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
      socket.emit("join", "10");
      socket.on("10", (message) => {
        setSendTo(message?.from);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: message.message,
            send_from: message.from,
          },
        ]);

        if (true) {
          audio
            .play()
            .catch((error) => console.log("Audio playback failed:", error));
        }
      });
    }
  }, [socket?.id]);

  // implement socket end

  useEffect(() => {
    setMessages([]);
    const fetchMessages = async () => {
      if (clientId) {
        try {
          const clientMessage = await getMessages("10", clientId);
          // If clientMessage contains messages, update the state
          if (clientMessage?.length) {
            setMessages(clientMessage);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [clientId]);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.length ? (
          <div>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.send_from === "10" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                    message.send_from === "10"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
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
        ) : (
          ""
        )}
      </div>
      {clientId?.length ? (
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-white flex items-center"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 transition-colors duration-200"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500 h-full">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

export default ChatBoardForAdmin;
