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

import SockJS from "sockjs-client/dist/sockjs.js";
import { CompatClient, Stomp } from "@stomp/stompjs";

type StateType = {
   onlineUsers: string[];
   socket: CompatClient | null;
};

const initState: StateType = {
   onlineUsers: [],
   socket: null,
};

type ContextType = {
   state: StateType;
   setOnlineUsers: Dispatch<SetStateAction<string[]>>;
   setSocket: Dispatch<SetStateAction<CompatClient | null>>;
};

const initContext: ContextType = {
   state: initState,
   setOnlineUsers: () => {},
   setSocket: () => {},
};

const SocketContext = createContext<ContextType>(initContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
   const [socket, setSocket] = useState<CompatClient | null>(null);
   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

   // hooks
   const { auth, loading } = useAuth();

   useEffect(() => {
      if (loading || !auth) return;

      let stompClient: WebSocket;

      const handleInitSocketJS = async () => {
         try {
            const ws = new SockJS("http://localhost:8080/messages/");
            const stompClient = Stomp.over(ws);

            stompClient.connect({}, () => {
               stompClient.subscribe("/topic/messages", (m) => {
                  console.log("received: ", m.body);
               });

               // must send to /user/{username}/queue destination
               stompClient.subscribe("/user/queue", (m) => {
                  console.log("received private: ", m.body);
               });
            });

            setSocket(stompClient);
         } catch (error) {
            console.log({ message: error });
         }
      };

      handleInitSocketJS();

      return () => {
         if (stompClient) stompClient.close();
      };
   }, [loading, auth]);

   return (
      <SocketContext.Provider value={{ state: { socket, onlineUsers }, setOnlineUsers, setSocket }}>
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
