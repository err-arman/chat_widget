"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import createAxiosInstance from "@/utils/api";
import { userAgent } from "next/server";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

interface MessagePreview {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
}

interface Client {
  id: number;
  created_at: string;
  socket_id: string;
  clientid: string;
  sent_to: string;
  client_id: string;
  updated_at: string;
  lastmessage?: string;
  client_socket_id: string;
  lastmessagedate?: string;
}

const MessageList = () => {
  const [client, setClient] = useState<Client[]>([]);
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const axios = createAxiosInstance();

  const getClientList = async () => {
    try {
      const result = await axios.get(`/client`);
      setClient(result.data.data);
    } catch (error) {
      console.log(`error in getClientList`, error);
    }
  };

  useEffect(() => {
    getClientList();
  }, []);

  // implement socket start
  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL_ROOT}`, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketInstance.on("new-client", (newClient) => {
      console.log("new client", newClient);
      setClient((prevClients) => [
        {
          ...newClient,
          client_socket_id: newClient.socket_id,
          clientid: newClient.socket_id,
          lastmessage: null,
          lastmessagedate: null,
        },
        ...prevClients,
      ]);
      // setClient((prevClients) => [newClient, ...prevClients]);
      setIsConnected(true);
    });


    // socketInstance.on();

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Messages</h2>
      {client.map((client: Client) => (
        <div
          onClick={() => {
            router.push(`?clientId=${client.clientid === "100" ? client.client_socket_id : client.clientid}`);
          }}
          key={`${client.client_id}`}
          className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <div className="flex-shrink-0">
            <User className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2" />
          </div>
          <div className="flex-1 min-w-0">
            <div>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {client.clientid === "100" ? client.client_socket_id : client.clientid}
              </p>
              <p className="text-sm font-medium text-gray-500 truncate">
                {client.lastmessage || "No messages yet"}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            {/* <p className="text-xs text-gray-400">{message.timestamp}</p> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
