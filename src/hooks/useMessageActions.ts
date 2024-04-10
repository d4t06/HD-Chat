import { sleep } from "@/utils/appHelper";
import { useState } from "react";
import usePrivateRequest from "./usePrivateRequest";
import { useDispatch } from "react-redux";
import { storingConversation } from "@/stores/CurrentConversationSlice";
import { useSocket } from "@/stores/SocketContext";

const MESSAGE_URL = "/messages";

export default function useMessageActions() {
   const [isFetching, setIsFetching] = useState(false);

   // hooks
   const dispatch = useDispatch();
   const { socket } = useSocket();

   const privateRequest = usePrivateRequest();

   const getCurrentConversationMessages = async (conversation_id: number) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         const res = await privateRequest.get(`${MESSAGE_URL}?conversationID=${conversation_id}`);
         return res.data.data as Message[];
      } catch (error) {
         console.log(error);
      } finally {
         setIsFetching(false);
      }
   };

   const sendMessage = async (message: MessageSchema, { update = true }: { update?: boolean }) => {
      try {
         if (!socket) return;

         const res = await privateRequest.post(MESSAGE_URL, message);
         const newMessage = res.data.data as Message;

         if (update) {
            dispatch(
               storingConversation({
                  messages: [newMessage],
               })
            );
         }

         socket.send("/app/messages", {}, JSON.stringify(message));

         return newMessage;
      } catch (error) {
         console.log({ message: error });
      }
   };

   return {
      isFetching,
      sendMessage,
      getCurrentConversationMessages,
   };
}
