import { useState } from "react";
import usePrivateRequest from "./usePrivateRequest";

const CONVERSATION_URL = "/conversations";

export default function useConversationActions() {
   const [isFetching, setIsFetching] = useState(false);

   const privateRequest = usePrivateRequest();

   const createConversation = async ({ name }: { name: string }) => {
      const res = await privateRequest.post(CONVERSATION_URL, { name });
      return res.data.data as Conversation;
      // try {
      // } catch (error) {
      //    console.log({ message: error });
      // }
   };

   const invite = async () => {};

   return { isFetching, createConversation };
}
