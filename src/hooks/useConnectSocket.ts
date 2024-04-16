import { useAuth } from "@/stores/AuthContext";
import { useSocket } from "@/stores/SocketContext";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useEffect } from "react";
import SockJS from "sockjs-client/dist/sockjs.js";

export default function useConnectSocket() {
   const { auth, loading } = useAuth();
   const { setSocket } = useSocket();

   useEffect(() => {
      if (loading || !auth) return;

      let stompClient: CompatClient;

      const handleInitSocketJS = async () => {
         try {
            const ws = new SockJS("http://localhost:8080/messages/");
            stompClient = Stomp.over(ws);

            setSocket(stompClient);
         } catch (error) {
            console.log({ message: error });
         }
      };

      handleInitSocketJS();

      return () => {
         if (stompClient) stompClient.disconnect();
      };
   }, [loading]);
}
