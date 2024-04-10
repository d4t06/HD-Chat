import { useAuth } from "@/stores/AuthContext";
import { selectCurrentConversation, storingConversation } from "@/stores/CurrentConversationSlice";
import { useSocket } from "@/stores/SocketContext";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useListenMessage() {
   const { socket } = useSocket();
   const { auth } = useAuth();
   const dispatch = useDispatch();

   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   const storeRef = useRef(currentConversationInStore);

   const handleReceiveMessage = (message: Message) => {
      console.log("check current", storeRef.current);
      console.log("check message", message);

      if (message.conversation_id === storeRef.current?.id) {
         dispatch(
            storingConversation({
               messages: [message],
            })
         );
      } else {
         window.alert(`New message from ${message.from_user_id}`);
      }
   };

   useEffect(() => {
      if (!socket || !auth) return;
      if (!socket.onConnect) return;

      const notifyEle = document.querySelector(".notify") as HTMLAudioElement;

      socket.connect({}, () => {
         socket.subscribe(`/topic/messages/${auth.id}`, (m) => {
            if (notifyEle) {
               try {
                  notifyEle.play();
               } catch (error) {}
            }

            const payload = JSON.parse(m.body) as Message;
            handleReceiveMessage(payload);
         });
      });
   }, [socket]);

   useEffect(() => {
      storeRef.current = currentConversationInStore;
   }, [currentConversationInStore]);
}
