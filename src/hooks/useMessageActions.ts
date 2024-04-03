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

   const sendMessage = async () => {
      console.log("sent message");
   };

   return {
      isFetching,
      sendMessage,
      getCurrentConversationMessages,
   };
}
