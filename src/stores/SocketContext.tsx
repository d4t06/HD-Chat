import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useState,
} from "react";

import { CompatClient } from "@stomp/stompjs";

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
      setSocket,
      state: { onlineUsers, socket },
   } = useContext(SocketContext);

   return { onlineUsers, socket, setOnlineUsers, setSocket };
};

export default SocketProvider;
export { useSocket };
