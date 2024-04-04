import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useEffect,
   useState,
} from "react";
import { useAuth } from "./AuthContext";

import { Socket, io } from "socket.io-client";

type StateType = {
   onlineUsers: string[];
   socket: WebSocket | null;
};

const initState: StateType = {
   onlineUsers: [],
   socket: null,
};

type ContextType = {
   state: StateType;
   setOnlineUsers: Dispatch<SetStateAction<string[]>>;
   setSocket: Dispatch<SetStateAction<WebSocket | null>>;
};

const initContext: ContextType = {
   state: initState,
   setOnlineUsers: () => {},
   setSocket: () => {},
};

const SocketContext = createContext<ContextType>(initContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
   const [socket, setSocket] = useState<WebSocket | null>(null);
   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

   // hooks
   const { auth, loading } = useAuth();

   useEffect(() => {
      if (loading || !auth) return;

      // const socket = io("ws://localhost:8080", {
      //    path: "/ws",
      //    query: {
      //       userId: auth.fullName,
      //    },
      // });

      const ws = new WebSocket("ws://localhost:8080/ws");

      // ws.onopen = () => {
      //    console.log("open")
      // }

      setSocket(ws);

      return () => {
         ws.close();
      };
   }, [loading, auth]);

   return (
      <SocketContext.Provider
         value={{ state: { socket, onlineUsers }, setOnlineUsers, setSocket }}
      >
         {children}
      </SocketContext.Provider>
   );
};

const useSocket = () => {
   const {
      setOnlineUsers,
      state: { onlineUsers, socket },
   } = useContext(SocketContext);

   return { onlineUsers, socket, setOnlineUsers };
};

export default SocketProvider;
export { useSocket };
