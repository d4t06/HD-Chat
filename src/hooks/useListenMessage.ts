import { useAuth } from "@/stores/AuthContext";
import { useConversation } from "@/stores/ConversationContext";
import {
   selectCurrentConversation,
   storingMessages,
} from "@/stores/CurrentConversationSlice";
import { useSocket } from "@/stores/SocketContext";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useListenMessage() {
   const storeRef = useRef<Conversation | null>();

   // hooks
   const { socket } = useSocket();
   const { auth } = useAuth();
   const dispatch = useDispatch();
   const { setTempConversations } = useConversation();
   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   const handleReceiveMessage = (message: Message) => {
      if (message.conversation_id === storeRef.current?.id) {
         dispatch(
            storingMessages({
               messages: [message],
            })
         );
      } else {
         window.alert(`New message from ${message.from_user_id}`);
      }
   };

   const handleNewConversation = (c: Conversation) => {

      console.log('check conversation', c);
      
      setTempConversations((prev) => [c, ...prev]);
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

         socket.subscribe(`/topic/conversations/${auth.id}`, (m) => {
            if (notifyEle) {
               try {
                  notifyEle.play();
               } catch (error) {}
            }

            const payload = JSON.parse(m.body) as Conversation;
            handleNewConversation(payload);
         });
      });
   }, [socket]);

   useEffect(() => {
      storeRef.current = currentConversationInStore;
   }, [currentConversationInStore]);
}
