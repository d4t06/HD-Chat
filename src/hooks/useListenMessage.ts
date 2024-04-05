import {
   selectCurrentConversation,
   storingConversation,
} from "@/stores/CurrentConversationSlice";
import { useSocket } from "@/stores/SocketContext";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useListenMessage() {
   const { socket } = useSocket();
   const dispatch = useDispatch();

   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   useEffect(() => {
      if (!socket) return;
      socket.onmessage = function (e) {
         if (!currentConversationInStore) return;
         const newMessage = JSON.parse(e.data) as Message;

         dispatch(
            storingConversation({
               messages: [newMessage],
            })
         );
      };
   }, [socket, currentConversationInStore]);
}
