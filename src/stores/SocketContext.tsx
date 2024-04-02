import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import { Client } from "@stomp/stompjs";
import { Socket, io } from "socket.io-client";

type StateType = {
   onlineUsers: string[];
   socket: Socket | null;
};

const initState: StateType = {
   onlineUsers: [],
   socket: null,
};

type ContextType = {
   state: StateType;
   setOnlineUsers: Dispatch<SetStateAction<string[]>>;
   setSocket: Dispatch<SetStateAction<Socket | null>>;
};

const initContext: ContextType = {
   state: initState,
   setOnlineUsers: () => {},
   setSocket: () => {},
};

const SocketContext = createContext<ContextType>(initContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
   const [socket, setSocket] = useState<Socket | null>(null);
   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

   // hooks
   const { auth, loading } = useAuth();

   useEffect(() => {
      if (loading || !auth) return;

      const socket = io("http://localhost:8080", {
         path: "/websocket",
         query: {
            userId: auth.fullName,
         },
      });
      setSocket(socket);

      return () => {
         socket.close();
      };
   }, [loading, auth]);

   return (
      <SocketContext.Provider value={{ state: { socket, onlineUsers }, setOnlineUsers, setSocket }}>
         {children}
      </SocketContext.Provider>
   );
};

export default SocketProvider;
