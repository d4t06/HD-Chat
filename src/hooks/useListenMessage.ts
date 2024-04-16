import { useAuth } from "@/stores/AuthContext";
import { addMessage, addNewConversation } from "@/stores/ConversationSlice";
import {
   selectCurrentConversation,
   storingMessages,
} from "@/stores/CurrentConversationSlice";
import { useSocket } from "@/stores/SocketContext";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useListenMessage() {
   // hooks
   const { socket } = useSocket();
   const { auth } = useAuth();
   const dispatch = useDispatch();
   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   const storeRef = useRef<typeof currentConversationInStore | null>();

   const scrollToLastMessage = () => {
      const lastMessage = document.querySelector(".last-message") as HTMLDListElement;

      if (lastMessage)
         lastMessage.scrollIntoView({
            behavior: "smooth",
            block: "start",
         });
   };

   const handleReceiveMessage = (message: Message) => {
      if (message.conversation_id === storeRef.current?.conversation.id) {
         dispatch(
            storingMessages({
               messages: [message],
            })
         );

         scrollToLastMessage();
      } else {
         dispatch(addMessage({ message }));
      }
   };

   const handleNewConversation = (newConversationPayload: NewConversationPayload) => {
      if (!auth) return;

      console.log("check payload", newConversationPayload);

      dispatch(addNewConversation({ newConversationPayload, auth }));
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

            const payload = JSON.parse(m.body) as NewConversationPayload;

            console.log("check payload", payload);

            handleNewConversation(payload);
         });
      });

      return () => {
         socket.disconnect();
      };
   }, [socket]);

   useEffect(() => {
      storeRef.current = currentConversationInStore;
   }, [currentConversationInStore]);
}
