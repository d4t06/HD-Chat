import { sleep } from "@/utils/appHelper";
import { useState } from "react";
import usePrivateRequest from "./usePrivateRequest";

const MESSAGE_URL = "/messages";

export default function useMessageActions() {
   const [isFetching, setIsFetching] = useState(false);

   const privateRequest = usePrivateRequest();

   const getCurrentConversationMessages = async (conversation_id: number) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(1000);

         const res = await privateRequest.get(`${MESSAGE_URL}/${conversation_id}`);
         return res.data.data as Message[];
      } catch (error) {
         console.log(error);
      } finally {
         setIsFetching(false);
      }
   };

   const sendMessage = async (message: MessageSchema) => {
      try {
         const res = await privateRequest.post(MESSAGE_URL, message);
         const newMessage = res.data.data as Message;

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
